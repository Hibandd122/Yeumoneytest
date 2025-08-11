from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time

app = Flask(__name__)
CORS(app)

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

def check_url(site_name):
    url = urls.get(site_name)
    if not url:
        return None
    try:
        r = requests.get(url, headers=headers, timeout=10)
        final_url = r.url
        last_results[site_name] = final_url
        return final_url
    except:
        return None

@app.route("/get-url", methods=["POST"])
def get_url():
    data = request.json
    site_name = data.get("site", "").lower().strip()
    final_url = check_url(site_name)
    if final_url:
        return jsonify({"url": final_url})
    return jsonify({"error": "Site not found"}), 404

@app.route("/get-all", methods=["GET"])
def get_all():
    result = {}
    for name in urls:
        result[name] = check_url(name)
    return jsonify(result)
