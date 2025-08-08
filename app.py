import time
import random
import json
import re
import hashlib
import binascii
import urllib.parse
from flask import Flask, request, jsonify
from flask_cors import CORS
from uuid import uuid4
import numpy as np
import requests
import cv2
from Crypto.Cipher import AES, PKCS1_v1_5
from Crypto.Util.Padding import pad
from Crypto.PublicKey.RSA import construct
urls = {
    "vn88": "https://vn88fu.com",
    "m88": "https://bet88mu.com",
    "fb88": "https://fb88dq.com",
    "bk8": "https://bk8fp.com",
    "v9bet": "https://v9betgc.com",
    "188bet": "https://88betgk.com",
    "w88": "https://w88abc.com",
    "w88xlm": "https://w88xlm.com"
}
app = Flask(__name__)
CORS(app)  # Enable CORS cho tất cả route

tasks_status = {}
tasks_result = {}
class SlideSolver:
    def __init__(self, puzzle_piece, background):
        self.background = self._read_image(background)
        self.puzzle_piece = self._read_image(puzzle_piece)

    @staticmethod
    def load_image(url: str) -> np.ndarray:
        response = requests.get(url)
        return response.content

    @staticmethod
    def _read_image(image_source):
        if isinstance(image_source, bytes):
            return cv2.imdecode(np.frombuffer(image_source, np.uint8), cv2.IMREAD_ANYCOLOR)
        elif hasattr(image_source, 'read'):  # Checks if it's a file-like object
            return cv2.imdecode(np.frombuffer(image_source.read(), np.uint8), cv2.IMREAD_ANYCOLOR)
        else:
            raise TypeError("Invalid image source type. Must be bytes or a file-like object.")

    def find_puzzle_piece_position(self):
        # Apply edge detection
        edge_puzzle_piece = cv2.Canny(self.puzzle_piece, 100, 200)
        edge_background = cv2.Canny(self.background, 100, 200)

        edge_puzzle_piece_rgb = cv2.cvtColor(edge_puzzle_piece, cv2.COLOR_GRAY2RGB)
        edge_background_rgb = cv2.cvtColor(edge_background, cv2.COLOR_GRAY2RGB)

        res = cv2.matchTemplate(edge_background_rgb, edge_puzzle_piece_rgb, cv2.TM_CCOEFF_NORMED)
        _, _, _, max_loc = cv2.minMaxLoc(res)
        top_left = max_loc
        h, w = edge_puzzle_piece.shape[:2]

        center_x = top_left[0] + w // 2
        center_y = top_left[1] + h // 2
        bottom_right = (top_left[0] + w, top_left[1] + h)

        cv2.rectangle(self.background, top_left, bottom_right, (0, 0, 255), 2)
        cv2.line(self.background, (center_x, 0), (center_x, edge_background_rgb.shape[0]), (0, 255, 0), 2)
        cv2.line(self.background, (0, center_y), (edge_background_rgb.shape[1], center_y), (0, 255, 0), 2)
        # cv2.imwrite('output.png', self.background)

        return center_x  - 41 # -41 because we need the start of the piece, not the center
class LotParser:
    def __init__(self):
        self.mapping = {"(n[2:9])+.+(n[20:27])+.+(n[4]+n[8]+n[28]+n[25])":'n[21:24]'}
        self.lot = []
        self.lot_res = []
        for k, v in self.mapping.items():
            self.lot = self._parse(k)
            self.lot_res = self._parse(v)

    @staticmethod
    def _parse_slice(s):
        return [int(x) for x in s.split(':')]

    @staticmethod
    def _extract(part):
        return re.search(r'\[(.*?)\]', part).group(1)

    def _parse(self, s):
        parts = s.split('+.+')
        parsed = []
        for part in parts:
            if '+' in part:
                subs = part.split('+')
                parsed_subs = [self._parse_slice(self._extract(sub)) for sub in subs]
                parsed.append(parsed_subs)
            else:
                parsed.append([self._parse_slice(self._extract(part))])
        return parsed

    @staticmethod
    def _build_str(parsed, num):
        result = []
        for p in parsed:
            current = []
            for s in p:
                start = s[0]
                end = s[1] + 1 if len(s) > 1 else start + 1
                current.append(num[start:end])
            result.append(''.join(current))
        return '.'.join(result)

    def get_dict(self, lot_number):
        i = self._build_str(self.lot, lot_number)
        r = self._build_str(self.lot_res, lot_number)
        parts = i.split('.')
        a = {}
        current = a
        for idx, part in enumerate(parts):
            if idx == len(parts) - 1:
                current[part] = r
            else:
                current[part] = current.get(part, {})
                current = current[part]
        return a


lotParser = LotParser()  # doesn't need to calculate the lot and lot_res every time, so were gonna cache it


class Signer:
    encryptor_pubkey = construct((
        int("00C1E3934D1614465B33053E7F48EE4EC87B14B95EF88947713D25EECBFF7E74C7977D02DC1D9451F79DD5D1C10C29ACB6A9B4D6FB7D0A0279B6719E1772565F09AF627715919221AEF91899CAE08C0D686D748B20A3603BE2318CA6BC2B59706592A9219D0BF05C9F65023A21D2330807252AE0066D59CEEFA5F2748EA80BAB81".lower(),
            16),
        int("10001", 16))
    )

    @staticmethod
    def rand_uid():
        result = ''
        for _ in range(4):
            result += hex(int(65536 * (1 + random.random())))[2:].zfill(4)[-4:]
        return result

    @staticmethod
    def encrypt_symmetrical_1(o_text, random_str):
        key = random_str.encode('utf-8')
        iv = b'0000000000000000'
        cipher = AES.new(key, AES.MODE_CBC, iv)
        encrypted_bytes = cipher.encrypt(pad(o_text.encode('utf-8'), AES.block_size))

        return encrypted_bytes

    @staticmethod
    def encrypt_asymmetric_1(message: str) -> str:
        message_bytes = message.encode('utf-8')
        cipher = PKCS1_v1_5.new(Signer.encryptor_pubkey)
        encrypted_bytes = cipher.encrypt(message_bytes)
        encrypted_hex = binascii.hexlify(encrypted_bytes).decode('utf-8')

        return encrypted_hex

    @staticmethod
    def encrypt_w(raw_input, pt) -> str:
        if not pt or '0' == pt:
            return urllib.parse.quote_plus(raw_input)

        random_uid = Signer.rand_uid()
        enc_key: str
        enc_input: bytes

        if pt == "1":
            enc_key = Signer.encrypt_asymmetric_1(random_uid)
            enc_input = Signer.encrypt_symmetrical_1(raw_input, random_uid)
        else:  # elif pt == "2" # there's either "1" or "2"
            raise NotImplementedError("This type of encryption is not implemented yet. Create an issue")

        return binascii.hexlify(enc_input).decode() + enc_key

    @staticmethod
    def generate_pow(lot_number_pow, captcha_id_pow, hash_func, hash_version, bits, date, empty) -> dict:
        bit_remainder = bits % 4
        bit_division = bits // 4

        prefix = '0' * bit_division
        pow_string = f"{hash_version}|{bits}|{hash_func}|{date}|{captcha_id_pow}|{lot_number_pow}|{empty}|"

        while True:
            h = Signer.rand_uid()
            combined = pow_string + h
            hashed_value = None

            if hash_func == 'md5':
                hashed_value = hashlib.md5(combined.encode('utf-8')).hexdigest()
            elif hash_func == 'sha1':
                hashed_value = hashlib.sha1(combined.encode('utf-8')).hexdigest()
            elif hash_func == 'sha256':
                hashed_value = hashlib.sha256(combined.encode('utf-8')).hexdigest()

            if bit_remainder == 0:
                if hashed_value.startswith(prefix):
                    return {'pow_msg': pow_string + h, 'pow_sign': hashed_value}
            else:
                if hashed_value.startswith(prefix):
                    length = len(prefix)
                    threshold = None
                    if bit_remainder == 1:
                        threshold = 7
                    elif bit_remainder == 2:
                        threshold = 3
                    elif bit_remainder == 3:
                        threshold = 1

                    if length <= threshold:
                        return {'pow_msg': pow_string + h, 'pow_sign': hashed_value}

    @staticmethod
    def generate_w(data: dict, captcha_id: str, risk_type: str):
        lot_number = data['lot_number']
        pow_detail = data['pow_detail']
        abo = {"YUHD":"yaNq"}
        base = abo | {
            **Signer.generate_pow(lot_number, captcha_id, pow_detail['hashfunc'], pow_detail['version'],
                                  pow_detail['bits'], pow_detail['datetime'], ""),
            **lotParser.get_dict(lot_number),
            "biht": "1426265548",  # static
            "device_id": "",  # why is this empty!!
            "em": {  # save to have this static (see em.js)
                "cp": 0,  # checkCallPhantom
                "ek": "11",  # checkErrorKeys "11" as value is also fine
                "nt": 0,  # checkNightmare
                "ph": 0,  # checkPhantom
                "sc": 0,  # checkSeleniumMarker
                "si": 0,  # checkScriptFn
                "wd": 1,  # checkWebDriver
            },
            "gee_guard": {
                "roe": {  # "3" = no | "1" = yes
                    "auh": "3",  # HEADCHR_UA            | regex(/HeadlessChrome/) in UserAgent
                    "aup": "3",  # PHANTOM_UA            | regex(/PhantomJS/) in UserAgent
                    "cdc": "3",  # CDC                   | cdc check
                    "egp": "3",  # PHANTOM_LANGUAGE      | language header !== undefined
                    "res": "3",  # SELENIUM_DRIVER       | 35 selenium checks 💀
                    "rew": "3",  # WEBDRIVER             | webDriver check
                    "sep": "3",  # PHANTOM_PROPERTIES    | phantomJS check
                    "snh": "3",  # HEADCHR_PERMISSIONS   | checks browser version etc.
                }
            },
            "ep": "123",  # static
            "geetest": "captcha",  # static
            "lang": "zh",  # static
            "lot_number": lot_number,
        }

        left = SlideSolver(
            requests.get(f"https://static.geetest.com/{data['slice']}", timeout=10).content,
            requests.get(f"https://static.geetest.com/{data['bg']}", timeout=10).content
            ).find_puzzle_piece_position() + random.uniform(0, .5)
        base |= {
                "passtime": random.randint(600, 1200),  # time in ms it took to solve
                "setLeft": left,
                "userresponse": left / 1.0059466666666665 + 2  # 1.0059466666666665 = .8876 * 340 / 300
            }
        return Signer.encrypt_w(json.dumps(base), data["pt"])

class Geeked:
    def __init__(self, captcha_id: str, **kwargs):
        self.pass_token = None
        self.lot_number = None
        self.captcha_id = captcha_id
        self.challenge = str(uuid4())
        self.callback = Geeked.random()
        self.session = requests.Session(**kwargs)
        self.session.headers = {
            "connection": "keep-alive",
            "sec-ch-ua-platform": "\"Windows\"",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "sec-ch-ua-mobile": "?0",
            "accept": "*/*",
            "sec-fetch-site": "same-origin",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-dest": "script",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9"
        }
        self.session.base_url = "https://gcaptcha4.geevisit.com"

    @staticmethod
    def random() -> str:
        return f"geetest_{int(random.random() * 10000) + int(time.time() * 1000)}"

    def format_response(self, response: str) -> dict:
        # print(json.loads(response.split(f"{self.callback}(")[1][:-1]))
        return json.loads(response.split(f"{self.callback}(")[1][:-1])["data"]

    def load_captcha(self):
        params = {
            "captcha_id": self.captcha_id,
            "challenge": self.challenge,
            "client_type": "web",
            "risk_type": "slide",
            "lang": "eng",
            "callback": self.callback,
        }
        res = self.session.get("https://gcaptcha4.geevisit.com/load", params=params)
        return self.format_response(res.text)

    def submit_captcha(self, data: dict) -> dict:
        self.callback = Geeked.random()

        params = {
            "callback": self.callback,
            "captcha_id": self.captcha_id,
            "client_type": "web",
            "lot_number": self.lot_number,
            "risk_type": "slide",
            "payload": data["payload"],
            "process_token": data["process_token"],
            "payload_protocol": "1",
            "pt": "1",
            "w": Signer.generate_w(data, self.captcha_id, "slide"),
        }
        res = self.session.get("https://gcaptcha4.geevisit.com/verify", params=params).text
        res = self.format_response(res)

        if res.get("seccode") is None:
            raise Exception(f"Failed to submit captcha: {res}")

        return res["seccode"]

    def solve(self) -> dict:
        data = self.load_captcha()
        self.lot_number = data["lot_number"]
        seccode = self.submit_captcha(data)
        return seccode
@app.route('/post-captcha', methods=['POST'])
def post_captcha():
    data = request.get_json(force=True, silent=True) or request.form or {}
    captcha_id = data.get('captcha_id')
    if not captcha_id:
        return jsonify({"error": "Missing captcha_id"}), 400

    print(f"Received captcha_id: {captcha_id}")

    try:
        solver = Geeked(captcha_id)
        seccode = solver.solve()
        return jsonify({
            "message": "Captcha solved",
            "captcha_id": captcha_id,
            "seccode": seccode
        })
    except Exception as e:
        return jsonify({
            "error": "Failed to solve captcha",
            "details": str(e)
        }), 500
@app.route("/get-url", methods=["POST"])
def get_url():
    data = request.json
    site_name = data.get("site", "").lower().strip()

    url = urls.get(site_name)
    if url:
        return jsonify({"url": url})

    return jsonify({"error": "Site not found"}), 404
