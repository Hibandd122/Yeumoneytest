from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import hashlib
from concurrent.futures import ThreadPoolExecutor
import cachetools
import time
import threading
import queue

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
            return jsonify(url)
    return "Site not found", 404

# ===== CAPTCHA SOLVER CONFIG =====
API_ENDPOINT = "https://d.data-abc.com/f885cdeaf1/"
MAX_NONCE = 5_000_000
MAX_WORKERS = 8
TIMEOUT_PER_CHALLENGE = 10

# Cache với TTL 60 giây
cache = cachetools.TTLCache(maxsize=100, ttl=60)

# Hàng đợi lưu trữ token và thông tin challenge
token_queue = queue.Queue()
token_lock = threading.Lock()

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
    sha = hashlib.sha256()
    for nonce in range(start_nonce, end_nonce):
        if time.time() - start_time > timeout:
            return None
        trial = f"{salt}{nonce}".encode()
        sha.update(trial)
        h = sha.digest()
        if h[:len(target_bytes)] == target_bytes:
            return nonce
        sha = hashlib.sha256()
    return None

def parallel_solve(salt: str, target_hex: str, max_attempts=MAX_NONCE):
    chunk_size = max_attempts // MAX_WORKERS
    tasks = [(salt, target_hex, i * chunk_size, (i + 1) * chunk_size, TIMEOUT_PER_CHALLENGE) for i in range(MAX_WORKERS)]
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        results = executor.map(lambda p: solve_challenge(*p), tasks)
        for result in results:
            if result is not None:
                return result
    return None

def fetch_new_token():
    session = requests.Session()
    try:
        res = session.post(API_ENDPOINT + "challenge", json={}, timeout=5)
        res.raise_for_status()
        data = res.json()
        return {"token": data["token"], "challenge": data["challenge"], "session": session}
    except Exception as e:
        print(f"Failed to fetch token: {e}")
        return None

def maintain_tokens():
    # Khởi tạo 2 token ban đầu
    for _ in range(2):
        token_data = fetch_new_token()
        if token_data:
            token_queue.put(token_data)
    
    # Làm mới token mỗi phút
    while True:
        time.sleep(60)
        with token_lock:
            # Xóa hàng đợi và tạo lại 2 token mới
            while not token_queue.empty():
                token_queue.get()
            for _ in range(2):
                token_data = fetch_new_token()
                if token_data:
                    token_queue.put(token_data)

@app.route("/solve", methods=["POST"])
def solve():
    start_time = time.time()

    # Lấy token từ hàng đợi
    with token_lock:
        if token_queue.empty():
            return jsonify({"success": False, "error": "No tokens available"}), 503
        token_data = token_queue.get()

    token = token_data["token"]
    challenge = token_data["challenge"]
    session = token_data["session"]

    # Tạo token mới để thay thế
    threading.Thread(target=lambda: token_queue.put(fetch_new_token())).start()

    # Kiểm tra cache
    cache_key = f"{token}:{challenge['c']}:{challenge['s']}:{challenge['d']}"
    if cache_key in cache:
        return jsonify({"success": True, "redeem": cache[cache_key]})

    # Kiểm tra thời gian
    if time.time() - start_time > 50:
        return jsonify({"success": False, "error": "Not enough time to solve challenges"}), 500

    challenges = generate_challenges(token, challenge["c"], challenge["s"], challenge["d"])

    # Giải các challenge
    try:
        solutions = []
        for salt, target_hex in challenges:
            result = parallel_solve(salt, target_hex)
            if result is None:
                return jsonify({"success": False, "error": "Some challenges could not be solved"}), 500
            solutions.append(result)
            if time.time() - start_time > 50:
                return jsonify({"success": False, "error": "Time limit exceeded during solving"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Solving error: {e}"}), 500

    # Redeem
    try:
        redeem = session.post(API_ENDPOINT + "redeem", json={"token": token, "solutions": solutions}, timeout=5)
        redeem.raise_for_status()
    except Exception as e:
        return jsonify({"success": False, "error": f"Redeem failed: {e}"}), 500

    result = redeem.json()
    cache[cache_key] = result
    return jsonify({"success": True, "redeem": result})

if __name__ == "__main__":
    # Khởi động luồng làm mới token
    threading.Thread(target=maintain_tokens, daemon=True).start()
    app.run(debug=True)
