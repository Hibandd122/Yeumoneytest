from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

urls = {
    "vn88": "https://vn88zu.com",
    "m88": "https://bet88ve.com",
    "fb88": "https://fb88dq.com",
    "bk8": "https://bk8hn.com",
    "v9bet": "http://v9betlg.com",
    "188bet": "https://88betvb.com",
    "w88": "https://w88abc.com",
    "w88xlm": "https://w88xlm.com"
}

@app.route("/get-url", methods=["POST"])
def get_url():
    data = request.json
    site_name = data.get("site", "").lower().strip()

    url = urls.get(site_name)
    if url:
        return jsonify({"url": url})

    return jsonify({"error": "Site not found"}), 404
