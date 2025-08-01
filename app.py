from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import requests, re, time

app = Flask(__name__)
CORS(app)  # 🔥 Bật CORS cho tất cả route

URLS = {
    "vn88": "https://vn88ve.com",
    "m88": "https://bet88ve.com",
    "fb88": "https://fb88dq.com",
    "bk8": "https://bk8xo.com",
    "v9bet": "http://v9betlg.com",
    "188bet": "https://88betux.com",
    "w88": "https://w88abc.com",
    "fun88": "https://fun88de.com",
}

HTML = '''
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bypass Tool</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .spinner {
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top-color: #ec4899;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      animation: spin 0.8s linear infinite;
      margin: auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .gradient-bg {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    }
    .glow {
      box-shadow: 0 0 15px rgba(236, 72, 153, 0.5);
    }
    .btn-hover {
      transition: all 0.3s ease;
      transform: translateY(0);
    }
    .btn-hover:hover {
      transform: scale(1.05) translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    }
    .btn-pulse {
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }
    .result-glow {
      animation: glowPulse 1.5s infinite alternate;
    }
    @keyframes glowPulse {
      0% { text-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
      100% { text-shadow: 0 0 15px rgba(34, 197, 94, 0.8); }
    }
    .logo-container {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 200px;
      margin: 0 auto;
      animation: logoFadeIn 1s ease-out;
    }
    .logo-container img {
      width: 100%;
      height: auto;
    }
    @keyframes logoFadeIn {
      0% { opacity: 0; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
    }
    .copy-btn {
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .result-container:hover .copy-btn {
      opacity: 1;
      transform: scale(1.1);
    }
    .mode-btn-red {
      background: linear-gradient(90deg, #dc2626, #b91c1c);
      border: 2px solid #f87171;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }
    .mode-btn-red::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }
    .mode-btn-red:hover::before {
      left: 100%;
    }
    .mode-btn-blue {
      background: linear-gradient(90deg, #2563eb, #1e40af);
      border: 2px solid #60a5fa;
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }
    .mode-btn-blue::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }
    .mode-btn-blue:hover::before {
      left: 100%;
    }
    .grid-btn-red {
      background: linear-gradient(90deg, #dc2626, #b91c1c);
      border: 1px solid #f87171;
      position: relative;
      overflow: hidden;
    }
    .grid-btn-red::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }
    .grid-btn-red:hover::before {
      left: 100%;
    }
    .grid-btn-red:hover {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }
    .grid-btn-blue {
      background: linear-gradient(90deg, #2563eb, #1e40af);
      border: 1px solid #60a5fa;
      position: relative;
      overflow: hidden;
    }
    .grid-btn-blue::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }
    .grid-btn-blue:hover::before {
      left: 100%;
    }
    .grid-btn-blue:hover {
      background: linear-gradient(90deg, #3b82f6, #2563eb);
    }
  </style>
</head>
<body class="gradient-bg min-h-screen flex items-center justify-center p-4 font-sans">
  <div class="bg-gray-800/80 backdrop-blur-lg w-full max-w-2xl p-8 rounded-2xl shadow-2xl space-y-8 glow">
    <!-- Logo SVG -->
    <div class="logo-container">
      <img src="https://yeumoney.com/theme_v2/assets/img/logo.svg" alt="YeuMoney Logo" class="w-full h-auto">
    </div>

    <h1 class="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse">
      🚀 Bypass Code Generator
    </h1>

    <div class="flex justify-center">
      <button id="modeBtn" onclick="toggle()"
        class="mode-btn-red btn-hover btn-pulse">
        Màu đỏ (Mặc định)
      </button>
    </div>

    <div id="buttonGrid" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {% for name, url in urls.items() %}
      <button onclick="run('{{name}}','{{url}}')"
        class="grid-btn-red py-3 px-4 rounded-lg font-semibold text-white btn-hover shadow-md">
        {{ name.upper() }}
      </button>
      {% endfor %}
    </div>

    <div id="countdown" class="text-center text-yellow-300 text-sm font-semibold hidden"></div>
    <div id="spinner" class="spinner hidden"></div>
    <div class="result-container relative flex justify-center items-center">
      <div id="result" class="text-center text-xl font-bold"></div>
      <button id="copyBtn" class="copy-btn absolute right-0 px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 btn-hover hidden">
        Copy
      </button>
    </div>
  </div>

<script>
let isDirect = false;
let timer;

function toggle() {
  isDirect = !isDirect;
  const btn = document.getElementById("modeBtn");
  const gridButtons = document.querySelectorAll("#buttonGrid button");

  if (isDirect) {
    btn.textContent = "Màu xanh";
    btn.className = "mode-btn-blue btn-hover btn-pulse";
    gridButtons.forEach(btn => {
      btn.className = "grid-btn-blue py-3 px-4 rounded-lg font-semibold text-white btn-hover shadow-md";
    });
  } else {
    btn.textContent = "Màu đỏ (Mặc định)";
    btn.className = "mode-btn-red btn-hover btn-pulse";
    gridButtons.forEach(btn => {
      btn.className = "grid-btn-red py-3 px-4 rounded-lg font-semibold text-white btn-hover shadow-md";
    });
  }

  document.getElementById("result").textContent = "";
  document.getElementById("countdown").classList.add("hidden");
  document.getElementById("copyBtn").classList.add("hidden");
}

function run(name, url) {
  const result = document.getElementById("result");
  const spinner = document.getElementById("spinner");
  const copyBtn = document.getElementById("copyBtn");
  result.innerHTML = '';
  spinner.classList.remove("hidden");
  copyBtn.classList.add("hidden");
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
      result.innerHTML = `✅ Mã: <span class="text-pink-300">${d.code}</span> <span class="text-sm text-gray-400">(${d.duration}s)</span>`;
      result.className = "text-center font-bold text-green-400 result-glow";
      copyBtn.classList.remove("hidden");
    } else {
      result.textContent = `❌ ${d.error}`;
      result.className = "text-center font-bold text-red-500";
    }
  })
  .catch((e) => {
    result.textContent = "❌ Lỗi: " + e;
    result.className = "text-center font-bold text-red-500";
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

document.getElementById("copyBtn").addEventListener("click", () => {
  const code = document.querySelector("#result .text-pink-300")?.textContent;
  if (code) {
    navigator.clipboard.writeText(code).then(() => {
      const copyBtn = document.getElementById("copyBtn");
      copyBtn.textContent = "Đã copy!";
      copyBtn.className = "copy-btn absolute right-0 px-3 py-1 text-sm font-medium text-white bg-green-800 rounded-lg btn-hover";
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.className = "copy-btn absolute right-0 px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 btn-hover";
      }, 2000);
    }).catch((err) => {
      console.error("Lỗi khi copy: ", err);
    });
  }
});
</script>
</body>
</html>
'''

@app.route('/')
def index():
    return render_template_string(HTML, urls=URLS)

@app.route('/bypass', methods=['POST'])
def bypass():
    data = request.get_json(force=True)
    type_value = data.get('type')

    if not type_value:
        return jsonify({'error': 'Thiếu type'}), 400

    is_url = type_value.startswith('http://') or type_value.startswith('https://')
    base_url = type_value if is_url else URLS.get(type_value)
    if not base_url:
        return jsonify({'error': 'URL không hợp lệ'}), 400

    headers = {"referer": base_url}
    common_data = {
        "codexnd": "maygayvai",
        "clk": "1000",
        "url": f"{base_url}/admin",
        "loai_traffic": base_url
    }

    # 🔁 Đã đảo ngược điều kiện ở đây:
    endpoint = "data_verify.php" if not is_url else "big_verify.php"
    full_url = f"https://data-abc.com/{endpoint}"

    try:
        t = time.time()
        r = requests.post(full_url, params=common_data, headers=headers, data=common_data, timeout=15)

        m1 = re.search(r'id="layma_me_dataabc"[^>]*>\s*(\d+)', r.text)
        m2 = re.search(r'id="layma_me_bigdata"[^>]*>\s*(\d+)', r.text)

        if m1 or m2:
            return jsonify({'code': (m1 or m2).group(1), 'duration': round(time.time() - t, 2)})
        else:
            return jsonify({'error': 'Không tìm thấy mã'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500
