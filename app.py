from flask import Flask, request, jsonify, render_template_string
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

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Bypass Code Generator</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #3b82f6;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            animation: spin 1s linear infinite;
            margin: auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
    <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 class="text-2xl font-bold text-center mb-6 text-blue-700">Chọn loại để lấy mã</h1>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {% for type in types %}
                <button onclick="getCode('{{ type }}')"
                        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                    {{ type | upper }}
                </button>
            {% endfor %}
        </div>

        <div id="countdown" class="text-center text-yellow-600 text-lg font-semibold mb-2 hidden"></div>
        <div id="spinner" class="spinner hidden"></div>
        <div id="result" class="text-center text-lg font-semibold mt-4"></div>
    </div>

    <script>
        let countdownInterval;

        function startCountdown(duration = 80) {
            const countdownEl = document.getElementById('countdown');
            let timeLeft = duration;
            countdownEl.classList.remove('hidden');
            countdownEl.classList.remove('text-green-600');
            countdownEl.textContent = `⏳ Đợi: ${timeLeft}s`;

            clearInterval(countdownInterval);
            countdownInterval = setInterval(() => {
                timeLeft--;
                countdownEl.textContent = `⏳ Đợi: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    countdownEl.textContent = `✅ Đã hết thời gian đợi`;
                    countdownEl.classList.add('text-green-600');
                }
            }, 1000);
        }

        async function getCode(type) {
            const result = document.getElementById('result');
            const spinner = document.getElementById('spinner');

            result.innerHTML = '';
            spinner.classList.remove('hidden');
            startCountdown(80);

            try {
                const res = await fetch('/bypass', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({type})
                });

                const data = await res.json();
                if (data.code) {
                    result.innerHTML = `✅ Mã: <span class="text-blue-700">${data.code}</span>
                        (⏱ ${data.duration}s)
                        <button onclick="copyToClipboard('${data.code}')" class="ml-2 text-sm text-green-600 hover:underline">[Sao chép]</button>`;
                    result.className = 'text-center text-green-600 font-semibold mt-4';
                } else {
                    result.textContent = `❌ ${data.error || 'Lỗi không xác định'}`;
                    result.className = 'text-center text-red-600 font-semibold mt-4';
                }
            } catch (err) {
                result.textContent = `❌ Lỗi fetch: ${err.message}`;
                result.className = 'text-center text-red-600 font-semibold mt-4';
            } finally {
                spinner.classList.add('hidden');
            }
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => alert("Đã sao chép mã: " + text))
                .catch(() => alert("Không sao chép được."));
        }
    </script>
</body>
</html>
'''

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE, types=URLS.keys())

@app.route('/bypass', methods=['POST'])
def bypass():
    json_data = request.get_json() or {}
    type = json_data.get('type')

    if type not in URLS:
        return jsonify({'error': 'Loại không hợp lệ'}), 400

    base_url = URLS[type]
    start = time.time()
    try:
        response = requests.post(
            f'https://traffic-user.net/GET_MA.php?codexn=maygayvai&url={base_url}/admin&loai_traffic=https://www.google.com/&clk=1000',
            timeout=15
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    html = response.text
    match = re.search(r'<span id="layma_me_vuatraffic"[^>]*>\s*(\d+)\s*</span>', html)
    if match:
        duration = round(time.time() - start, 2)
        return jsonify({'code': match.group(1), 'duration': duration}), 200
    return jsonify({'error': 'Không trích xuất được mã'}), 400
