from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import hashlib
from multiprocessing import Pool, cpu_count

app = Flask(__name__)
CORS(app)

# ===== URL MAP =====
urls = {
    "vn88": "https://vn88zu.com",
    "m88": "https://bet88ve.com",
    "fb88": "https://fb88dq.com",
    "bk8": "https://bk8hn.com",
    "v9bet": "http://v9betlg.com",
    "188bet": "https://88betux.com",
    "w88": "https://w88abc.com",
    "fun88": "https://fun88de.com",
    "w88 w88xlm": "https://w88xlm.com"
}

@app.route("/get-url", methods=["POST"])
def get_url():
    data = request.json
    site_name = data.get("site", "").lower().strip()

    for name, url in urls.items():
        if site_name in name.lower():
            return jsonify(url)  # chỉ trả về chuỗi URL
    return "Site not found", 404


# ===== CAPTCHA SOLVER CONFIG =====
API_ENDPOINT = "https://d.data-abc.com/f885cdeaf1/"
MAX_NONCE = 5_000_000  # có thể tăng lên nếu cần
WORKERS = cpu_count()


def d(seed: str, length: int) -> str:
    def fnv1a_32(s):
        h = 0x811c9dc5
        for c in s:
            h ^= ord(c)
            h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
            h &= 0xFFFFFFFF
        return h

    def rng(state):
        state ^= (state << 13) & 0xFFFFFFFF
        state ^= (state >> 17) & 0xFFFFFFFF
        state ^= (state << 5) & 0xFFFFFFFF
        return state & 0xFFFFFFFF

    state = fnv1a_32(seed)
    result = []
    while len("".join(result)) < length:
        state = rng(state)
        result.append(hex(state)[2:].rjust(8, '0'))
    return "".join(result)[:length]


def generate_challenges(token, c, s_len, d_len):
    return [(d(f"{token}{i}", s_len), d(f"{token}{i}d", d_len)) for i in range(1, c + 1)]


def solve_challenge(salt: str, target_hex: str, max_attempts=MAX_NONCE):
    target_bytes = bytes.fromhex(target_hex)
    for nonce in range(max_attempts):
        trial = f"{salt}{nonce}".encode()
        h = hashlib.sha256(trial).digest()
        if h[:len(target_bytes)] == target_bytes:
            return nonce
    return None


@app.route("/solve", methods=["POST"])
def solve():
    session = requests.Session()

    # STEP 1: Get challenge
    try:
        res = session.post(API_ENDPOINT + "challenge", json={})
        res.raise_for_status()
    except Exception as e:
        return jsonify({"success": False, "error": f"Challenge fetch failed: {e}"}), 500

    try:
        data = res.json()
        token = data["token"]
        challenge = data["challenge"]
        c, s_len, d_len = challenge["c"], challenge["s"], challenge["d"]
    except Exception as e:
        return jsonify({"success": False, "error": f"Invalid challenge format: {e}"}), 500

    challenges = generate_challenges(token, c, s_len, d_len)

    # STEP 2: Solve using multiprocessing
    try:
        with Pool(processes=WORKERS) as pool:
            solutions = pool.starmap(solve_challenge, challenges)
    except Exception as e:
        return jsonify({"success": False, "error": f"Solving error: {e}"}), 500

    if any(s is None for s in solutions):
        return jsonify({"success": False, "error": "Some challenges could not be solved"}), 500

    # STEP 3: Redeem
    try:
        redeem = session.post(API_ENDPOINT + "redeem", json={"token": token, "solutions": solutions})
        redeem.raise_for_status()
    except Exception as e:
        return jsonify({"success": False, "error": f"Redeem failed: {e}"}), 500

    result = redeem.json()
    return jsonify({"success": True, "redeem": result})
