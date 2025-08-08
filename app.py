from flask import Flask, request, jsonify , send_from_directory
from flask_cors import CORS
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
@app.route("/get-url", methods=["POST"])
def get_url():
    data = request.json
    site_name = data.get("site", "").lower().strip()

    url = urls.get(site_name)
    if url:
        return jsonify({"url": url})

    return jsonify({"error": "Site not found"}), 404
@app.route('/Bypass.js', methods=["GET", "POST"])
def bypass_js():
    with open('Bypass.js', 'r', encoding='utf-8') as f:
        js_code = f.read()
    if request.method == "POST":
        # Có thể xử lý data nếu muốn, nhưng vẫn trả về js_code
        return js_code, 200, {"Content-Type": "application/javascript"}
    else:
        return js_code, 200, {"Content-Type": "application/javascript"}
