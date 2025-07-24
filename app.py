from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import requests, re, time

app = Flask(__name__)
CORS(app)  # 🔥 Bật CORS cho tất cả route

URLS = {
    "vn88": "https://vn88bc.com",
    "m88": "https://bet88ec.com",
    "fb88": "https://fb88dq.com",
    "bk8": "https://bk8xo.com",
    "v9bet": "hhttps://v9betlg.com",
    "188bet": "https://88betag.com",
    "w88": "https://w88abc.com"
}

HTML = '''
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bypass</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
.hidden { display: none; }
.spinner {
  border: 4px solid rgba(255,255,255,0.1);
  border-left-color: #c084fc;
  border-radius: 50%;
  width: 28px; height: 28px;
  animation: spin 1s linear infinite; margin: auto;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body class="bg-black min-h-screen flex items-center justify-center p-4">
<div class="bg-zinc-900 text-white p-6 rounded-lg shadow-xl w-full max-w-xl">
  <h1 class="text-2xl font-bold text-center text-purple-400 mb-4">🚀 Bypass Code Generator</h1>

  <div class="flex justify-center mb-6">
    <button onclick="toggle()" id="modeBtn"
      class="transition px-4 py-2 rounded font-semibold text-white bg-sky-600 hover:bg-sky-700">
      Mặc định (Xanh)
    </button>
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
    {% for name, url in urls.items() %}
    <button onclick="run('{{name}}','{{url}}')"
      class="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded transition">
      {{ name.upper() }}
    </button>
    {% endfor %}
  </div>

  <div id="countdown" class="hidden text-yellow-400 text-center text-sm font-semibold mb-2"></div>
  <div id="spinner" class="spinner hidden mb-2"></div>
  <div id="result" class="text-center text-lg font-semibold text-white"></div>
</div>

<script>
let isDirect = false;
let timer;

function toggle() {
  isDirect = !isDirect;
  const btn = document.getElementById("modeBtn");
  btn.textContent = isDirect ? "Direct (Đỏ)" : "Mặc định (Xanh)";
  btn.className = isDirect
    ? "transition px-4 py-2 rounded font-semibold text-white bg-red-600 hover:bg-red-700"
    : "transition px-4 py-2 rounded font-semibold text-white bg-sky-600 hover:bg-sky-700";
  document.getElementById("result").textContent = "";
  document.getElementById("countdown").classList.add("hidden");
}

function run(name, url) {
  const result = document.getElementById("result");
  const spinner = document.getElementById("spinner");
  result.innerHTML = '';
  spinner.classList.remove("hidden");
  startCountdown(80);

  const payload = { type: isDirect ? url : name };

  fetch("/bypass", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  .then((r) => r.json())
  .then((d) => {
    if (d.code) {
      result.innerHTML = `✅ Mã: <span class="text-purple-300">${d.code}</span> <span class="text-sm text-gray-400">(${d.duration}s)</span>`;
      result.className = "text-center font-semibold text-green-400";
    } else {
      result.textContent = `❌ ${d.error}`;
      result.className = "text-center font-semibold text-red-500";
    }
  })
  .catch((e) => {
    result.textContent = "❌ Lỗi: " + e;
    result.className = "text-center font-semibold text-red-500";
  })
  .finally(() => spinner.classList.add("hidden"));
}

function startCountdown(t) {
  const el = document.getElementById("countdown");
  clearInterval(timer);
  el.classList.remove("hidden");
  el.classList.remove("text-green-400");
  timer = setInterval(() => {
    el.textContent = `⏳ Đợi: ${t}s`;
    if (t-- <= 0) {
      clearInterval(timer);
      el.textContent = "✅ Hết thời gian";
      el.classList.add("text-green-400");
    }
  }, 1000);
}
</script>
</body></html>
'''

@app.route('/')
def index():
    return render_template_string(HTML, urls=URLS)

@app.route('/bypass', methods=['POST'])
def bypass():
    data = request.get_json()
    type_value = data.get('type')
    if not type_value:
        return jsonify({'error': 'thiếu type'}), 400

    is_url = type_value.startswith('http://') or type_value.startswith('https://')
    keyword = type_value if not is_url else None
    url = type_value if is_url else URLS.get(type_value)
    if not is_url and keyword not in URLS:
        return jsonify({'error': 'Tên miền không hợp lệ'}), 400
    if is_url and not url:
        return jsonify({'error': 'URL không hợp lệ'}), 400

    base_url = "https://traffic-user.net/"
    endpoint = "GET_MD.php" if is_url else "GET_MA.php"
    regex = r'id="layma_me_tfudirect"[^>]*>\s*(\d+)' if is_url else r'id="layma_me_vuatraffic"[^>]*>\s*(\d+)'
    full_url = f"{base_url}{endpoint}?codexn=maygayvai&url={url}/admin&loai_traffic=https://www.google.com/&clk=1000"

    try:
        t = time.time()
        r = requests.post(full_url, timeout=15)
        m = re.search(regex, r.text)
        if m:
            return jsonify({'code': m.group(1), 'duration': round(time.time()-t, 2)})
        return jsonify({'error': 'Không tìm thấy mã'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
