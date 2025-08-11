from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import threading
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS cho tất cả route

urls = {
    "vn88": "https://vn88fu.com",
    "m88": "https://bet88mu.com",
    "fb88": "https://fb88dq.com",
    "bk8": "https://bk8fp.com",
    "v9bet": "https://v9betgc.com",
    "188bet": "https://88betgk.com",
    "w88": "https://w88abc.com",
    "w88 xlm": "https://w88xlm.com"
}

headers = {"User-Agent": "Mozilla/5.0"}
last_results = {}

def monitor_urls():
    while True:
        for name, url in urls.items():
            try:
                r = requests.get(url, headers=headers, timeout=10)
                final_url = r.url
                if last_results.get(name) != final_url:
                    last_results[name] = final_url
                    print(f"[{name}] đổi thành: {final_url}")
                    with open("changed_urls.txt", "a", encoding="utf-8") as f:
                        f.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} - {name}: {final_url}\n")
            except requests.RequestException as e:
                print(f"[{name}] lỗi: {e}")
        time.sleep(5)

@app.route("/get-url", methods=["POST"])
def get_url():
    data = request.json
    site_name = data.get("site", "").lower().strip()
    final_url = last_results.get(site_name)
    if final_url:
        return jsonify({"url": final_url})
    return jsonify({"error": "Site not found"}), 404

monitor_urls()
