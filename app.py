from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import hashlib
from concurrent.futures import ThreadPoolExecutor
import cachetools
import time

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
            return jsonify(url)
    return "Site not found", 404

# === CAPTCHA SOLVER CONFIG ===
API_ENDPOINT = "https://d.data-abc.com/f885cdeaf1/"
MAX_NONCE = 1_000_000
MAX_WORKERS = 10
TIMEOUT_PER_CHALLENGE = 100
cache = cachetools.TTLCache(maxsize=100, ttl=60)

# ==== UTILS ====
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

def solve_challenge(salt: str, target_hex: str, start_nonce: int, end_nonce: int, timeout: float):
    start_time = time.time()
    target_bytes = bytes.fromhex(target_hex)
    for nonce in range(start_nonce, end_nonce):
        if time.time() - start_time > timeout:
            return None
        trial = f"{salt}{nonce}".encode()
        h = hashlib.sha256(trial).digest()
        if h[:len(target_bytes)] == target_bytes:
            return nonce
    return None

def thread_solve(salt: str, target_hex: str):
    chunk_size = MAX_NONCE // MAX_WORKERS
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [
            executor.submit(solve_challenge, salt, target_hex, i * chunk_size, (i + 1) * chunk_size, TIMEOUT_PER_CHALLENGE)
            for i in range(MAX_WORKERS)
        ]
        for future in futures:
            result = future.result()
            if result is not None:
                return result
    return None

@app.route("/solve", methods=["POST"])
def solve():
    start_time = time.time()
    session = requests.Session()

    try:
        res = session.post(API_ENDPOINT + "challenge", json={}, timeout=5)
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

    cache_key = f"{token}:{c}:{s_len}:{d_len}"
    if cache_key in cache:
        return jsonify({"success": True, "redeem": cache[cache_key]})

    if time.time() - start_time > 50:
        return jsonify({"success": False, "error": "Not enough time to solve challenges"}), 500

    challenges = generate_challenges(token, c, s_len, d_len)

    try:
        with ThreadPoolExecutor(max_workers=c) as executor:
            futures = [executor.submit(thread_solve, salt, target_hex) for salt, target_hex in challenges]
            solutions = [f.result() for f in futures]

        if any(s is None for s in solutions):
            return jsonify({"success": False, "error": "Some challenges could not be solved"}), 500
        if time.time() - start_time > 50:
            return jsonify({"success": False, "error": "Time limit exceeded during solving"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Solving error: {e}"}), 500

    try:
        redeem = session.post(API_ENDPOINT + "redeem", json={"token": token, "solutions": solutions}, timeout=5)
        redeem.raise_for_status()
    except Exception as e:
        return jsonify({"success": False, "error": f"Redeem failed: {e}"}), 500

    result = redeem.json()
    cache[cache_key] = result
    return jsonify({"success": True, "redeem": result})
