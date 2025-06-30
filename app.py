from flask import Flask, request, jsonify, render_template
import requests
import re
import time

app = Flask(__name__)

URLS = {
    "vn88": "https://vn88no.com",
    "m88": "https://bet88ec.com",
    "fb88": "https://fb88mg.com",
    "bk8": "https://bk8ze.com",
    "v9bet": "https://v9betse.com",
    "188bet": "https://88betag.com",
    "w88": "https://188.166.185.213"
}

@app.route('/')
def index():
    return render_template('index.html', types=URLS.keys())

@app.route('/bypass', methods=['POST'])
def bypass():
    json_data = request.get_json() or {}
    type = json_data.get('type')

    if type not in URLS:
        return jsonify({'error': 'Invalid type'}), 400

    base_url = URLS[type]
    start = time.time()
    try:
        response = requests.post(
            f'https://traffic-user.net/GET_MA.php?codexn=maygayvai&url={base_url}/admin&loai_traffic=https://www.google.com/&clk=1000'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    html = response.text
    match = re.search(r'<span id="layma_me_vuatraffic"[^>]*>\s*(\d+)\s*</span>', html)
    if match:
        duration = round(time.time() - start, 2)
        return jsonify({'code': match.group(1), 'duration': duration}), 200
    return jsonify({'error': 'Cannot extract code from response'}), 400
