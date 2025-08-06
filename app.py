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
MAX_NONCE = 5_000_000
WORKERS = cpu_count()  # tự động lấy số core CPU

# =================== HÀM HASH & GIẢI ===================

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
    out = ""
    while len(out) < length:
        state = rng(state)
        out += hex(state)[2:].rjust(8, '0')
    return out[:length]


def generate_challenges(token, c, s, d_):
    return [(d(f"{token}{i}", s), d(f"{token}{i}d", d_)) for i in range(1, c + 1)]


def solve_single_challenge(args):
    salt, target_hex = args
    target_bytes = bytes.fromhex(target_hex)
    for nonce in range(MAX_NONCE):
        trial = f"{salt}{nonce}".encode()
        h = hashlib.sha256(trial).digest()
        if h[:len(target_bytes)] == target_bytes:
            return nonce
    return None

# =================== ROUTE SOLVE ===================

@app.route("/solve", methods=["POST"])
def solve():
    session = requests.Session()

    # Step 1: Lấy challenge
    try:
        res = session.post(API_ENDPOINT + "challenge", json={})
        res.raise_for_status()
    except Exception as e:
        return jsonify({"success": False, "error": f"Lỗi lấy challenge: {e}"}), 500

    data = res.json()
    token = data["token"]
    challenge = data["challenge"]
    c, s_len, d_len = challenge["c"], challenge["s"], challenge["d"]

    challenges = generate_challenges(token, c, s_len, d_len)

    # Step 2: Giải challenge bằng multiprocessing
    start_time = time.time()
    with Pool(processes=WORKERS) as pool:
        solutions = pool.map(solve_single_challenge, challenges)
    duration = time.time() - start_time

    if any(s is None for s in solutions):
        return jsonify({"success": False, "error": "Không giải được 1 số challenge"}), 500

    # Step 3: Gửi redeem
    try:
        redeem = session.post(API_ENDPOINT + "redeem", json={"token": token, "solutions": solutions})
        redeem.raise_for_status()
    except Exception as e:
        return jsonify({"success": False, "error": f"Lỗi redeem: {e}"}), 500

    result = redeem.json()
    return jsonify({
        "success": True,
        "redeem": result,
        "solving_time_sec": round(duration, 2),
        "used_cores": WORKERS
    })


