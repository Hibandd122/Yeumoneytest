from flask import Flask, jsonify, request
import requests
import hashlib
from concurrent.futures import ThreadPoolExecutor
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
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

# === CẤU HÌNH ===
API_ENDPOINT = "https://d.data-abc.com/f885cdeaf1/"
MAX_NONCE = 5_000_000
WORKERS = 8

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

    # Step 1: get challenge
    try:
        res = session.post(API_ENDPOINT + "challenge", json={})
        res.raise_for_status()
    except Exception as e:
        return jsonify({"success": False, "error": f"Challenge fetch failed: {e}"}), 500

    data = res.json()
    token = data["token"]
    challenge = data["challenge"]
    c, s_len, d_len = challenge["c"], challenge["s"], challenge["d"]

    challenges = generate_challenges(token, c, s_len, d_len)

    # Step 2: solve in thread pool
    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        solutions = list(executor.map(lambda ch: solve_challenge(*ch), challenges))

    if any(s is None for s in solutions):
        return jsonify({"success": False, "error": "Some challenges could not be solved"}), 500

    # Step 3: redeem
    try:
        redeem = session.post(API_ENDPOINT + "redeem", json={"token": token, "solutions": solutions})
        redeem.raise_for_status()
    except Exception as e:
        return jsonify({"success": False, "error": f"Redeem failed: {e}"}), 500

    result = redeem.json()
    return jsonify({"success": True, "redeem": result})

if __name__ == "__main__":
    app.run(debug=True)
