from flask import Flask, request, jsonify
import cloudscraper
import re

app = Flask(__name__)
scraper = cloudscraper.create_scraper()

def extract_page_data(url):
    resp = scraper.get(url)
    if resp.status_code != 200:
        return {"error": f"GET lỗi: {resp.status_code}"}
    html = resp.text
    user = re.search(r'var userlink = "([^"]+)"', html)
    code_link = re.search(r'var code_link = "([^"]+)"', html)
    token = re.search(r'/sovantay/creep\.js\?token=([a-f0-9]+)', html)
    if not (user and code_link and token):
        return {"error": "Không tìm thấy user/code_link/token"}
    return {
        "user": user.group(1),
        "code_link": code_link.group(1),
        "code": token.group(1)
    }

def extract_from_post_response(html):
    result = {}
    tukhoa = re.search(r"TUKHOA1\.innerHTML\s*=\s*'([^']+)'", html)
    hinh_nv = re.search(r"hinh_nv\.src\s*=\s*'([^']+)'", html)
    halt_nv = re.search(
        r'<img[^>]*id=[\'"]halt_nv[\'"][^>]*src=[\'"]([^\'"]+)[\'"][^>]*>',
        html,
        re.IGNORECASE | re.DOTALL
    )
    if tukhoa:
        result["TUKHOA1"] = tukhoa.group(1)
    if hinh_nv:
        result["hinh_nv"] = hinh_nv.group(1)
    if halt_nv:
        result["halt_nv"] = halt_nv.group(1)
    return result

@app.route('/fetch', methods=['GET'])
def fetch():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "Thiếu tham số url"}), 400

    data = extract_page_data(url)
    if "error" in data:
        return jsonify(data), 400

    post_url = f"https://yeumoney.com/quangly/load_nv_nhanh.php?code={data['code']}&code_link={data['code_link']}"
    post_data = {"user": data["user"]}
    headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://yeumoney.com",
        "Referer": f"https://yeumoney.com/{data['code_link']}",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest"
    }
    resp = scraper.post(post_url, data=post_data, headers=headers)
    if not resp.ok:
        return jsonify({"error": f"POST lỗi: {resp.status_code}"}), 400

    result = extract_from_post_response(resp.text)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
