import time
import random
import json
import re
import hashlib
import binascii
import urllib.parse
import threading
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
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

def wait_for_captcha(currentUrl, session, url, headers, max_attempts=10):
    token = ""
    for attempt in range(max_attempts):
        payload = {
            "timestamp": "",
            "currentUrl": currentUrl,
            "referrerUrl": "https://www.google.com/",
            "container": "",
            "token": token,
            "init": 0,
        }
        resp = session.post(url, json=payload, headers=headers)
        soup = BeautifulSoup(resp.text, "html.parser")
        span = soup.select_one("span.ymn-btn-text.ymn-countdown")

        if not span:
            print(f"Attempt {attempt+1}: Không tìm thấy span countdown, đợi 5s...")
            time.sleep(5)
            continue

        token = span.get("data-token", "")
        countdown = int(span.get("data-countdown", "30"))
        finish = span.get("data-finish", "")

        print(f"Lần {attempt+1}: token={token[:10]}..., đợi {countdown}s, finish={finish}")
        for sec in range(countdown, 0, -1):
            print(f"\rĐang đợi: {sec} giây...", end="", flush=True)
            time.sleep(1)
        print()

        if finish == "captcha":
            # Gửi thêm lần cuối lấy div captcha
            payload["token"] = token
            resp2 = session.post(url, json=payload, headers=headers)
            soup2 = BeautifulSoup(resp2.text, "html.parser")
            captcha_div = soup2.select_one("div.ymn-gt4")
            if captcha_div:
                captcha_id = captcha_div.get("data-captcha-id")
                span_token = soup2.find('span', {"data-token": True})
                token = span_token['data-token'] if span_token else token
                return token, captcha_id
            raise Exception("Không tìm thấy div captcha lần cuối")

    raise Exception("Không lấy được captcha sau nhiều lần thử")

def main(currentUrl, url):
    session = requests.Session()
    headers = {
        "Referer": currentUrl,
    }

    token, captcha_id = wait_for_captcha(currentUrl, session, url, headers)

    geeked = Geeked(captcha_id)
    sec_code = geeked.solve()

    payload_final = {
        "timestamp": "",
        "currentUrl": currentUrl,
        "referrerUrl": "https://www.google.com/",
        "container": "",
        "token": token,
        "init": 0,
        "gee_data": sec_code
    }
    resp_final = session.post(url, json=payload_final, headers=headers)
    soup_final = BeautifulSoup(resp_final.text, 'html.parser')
    code_span = soup_final.select_one('span.ymn-btn.ymn-noclick > span.ymn-btn-text')
    if code_span:
        code = code_span.get_text(strip=True)
        return code
    else:
        print("Không tìm thấy mã captcha trong response cuối.")

def cleanup_task(task_id, delay=60):
    time.sleep(delay)
    tasks_status.pop(task_id, None)
    tasks_result.pop(task_id, None)

def run_task(task_id, currentUrl, google_url):
    try:
        tasks_status[task_id] = "Wait"
        code = main(currentUrl, google_url)  # main phải trả về mã captcha
        tasks_status[task_id] = "done"
        tasks_result[task_id] = code
    except Exception as e:
        tasks_status[task_id] = "error: " + str(e)
        tasks_result[task_id] = None
    finally:
        # Sau khi done hoặc error, tạo thread để xoá sau 60s
        threading.Thread(target=cleanup_task, args=(task_id, 60), daemon=True).start()

def is_url(s):
    return isinstance(s, str) and s.lower().startswith(("http://", "https://"))

@app.route('/get-task', methods=['POST'])
def get_task():
    data = request.json or {}
    raw_url = data.get('url')

    if not raw_url:
        return jsonify({"error": "Missing parameter 'url'"}), 400

    if is_url(raw_url):
        # raw_url là link -> dùng direct
        currentUrl = raw_url
        url_to_use = "https://data-abc.com/embed/direct.php"
    else:
        # raw_url là từ khóa -> lấy link trong urls
        currentUrl = urls.get(raw_url.lower())
        if not currentUrl:
            return jsonify({"error": f"Keyword '{raw_url}' not supported"}), 400
        url_to_use = "https://data-abc.com/embed/google.php"

    task_id = str(uuid.uuid4())
    tasks_status[task_id] = "pending"

    thread = threading.Thread(target=run_task, args=(task_id, currentUrl, url_to_use), daemon=True)
    thread.start()

    return jsonify({"task_id": task_id})

@app.route('/get-status', methods=['POST'])
def get_status():
    data = request.json or {}
    task_id = data.get('task_id')

    if not task_id:
        return jsonify({"error": "Missing parameter 'task_id'"}), 400

    status = tasks_status.get(task_id)
    if status is None:
        return jsonify({"error": "Task not found"}), 404

    response = {
        "task_id": task_id,
        "status": status
    }
    if status == "done":
        response["captcha_code"] = tasks_result.get(task_id, None)

    return jsonify(response)
if __name__ == "__main__":
    app.run(debug=True)
