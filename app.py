from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
urls = {
    "vn88": "https://vn88lu.com",
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
