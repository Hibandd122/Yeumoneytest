// ==UserScript==
// @name         YeumoneyBypass
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Bypass Captcha Geetest
// @author       You and ChatGpt
// @match        https://yeumoney.com/*
// @grant        GM_xmlhttpRequest
// @connect      static.geetest.com
// @connect      gcaptcha4.geevisit.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/10.5.25/jsrsasign-all-min.js
// @require      https://docs.opencv.org/4.x/opencv.js
// ==/UserScript==
  "use strict";
  (async () => {
  await new Promise(resolve => {
    let wait = () => {
      if (cv && cv.Mat) resolve();
      else setTimeout(wait, 50);
    };
    wait();
  });

  // Wrapper GM_xmlhttpRequest thành Promise cho dễ dùng
  function gmFetch(url, method = "GET", headers = {}, responseType = "text") {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        headers,
        responseType,
        onload: res => {
          if (res.status >= 200 && res.status < 300) resolve(res);
          else reject(new Error(`Status ${res.status} for ${url}`));
        },
        onerror: e => reject(e),
      });
    });
  }

  async function loadImage(url) {
    let res = await gmFetch(url, "GET", {}, "blob");
    let blob = res.response;
    return await createImageBitmap(blob);
  }

  function imageBitmapToMat(imgBitmap) {
    let canvas = document.createElement("canvas");
    canvas.width = imgBitmap.width;
    canvas.height = imgBitmap.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(imgBitmap, 0, 0);
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return cv.matFromImageData(imgData);
  }

  async function findPuzzlePiecePosition(puzzleUrl, bgUrl) {
    let puzzleImg = await loadImage(puzzleUrl);
    let bgImg = await loadImage(bgUrl);

    let puzzleMat = imageBitmapToMat(puzzleImg);
    let bgMat = imageBitmapToMat(bgImg);

    let puzzleEdge = new cv.Mat();
    let bgEdge = new cv.Mat();

    cv.Canny(puzzleMat, puzzleEdge, 100, 200);
    cv.Canny(bgMat, bgEdge, 100, 200);

    let result = new cv.Mat();
    cv.matchTemplate(bgEdge, puzzleEdge, result, cv.TM_CCOEFF_NORMED);
    let mm = cv.minMaxLoc(result);
    let maxLoc = mm.maxLoc;

    let centerX = maxLoc.x + Math.floor(puzzleEdge.cols / 2);

    // Cleanup
    puzzleMat.delete();
    bgMat.delete();
    puzzleEdge.delete();
    bgEdge.delete();
    result.delete();

    return centerX - 41;
  }

  // ---- Signer class (simplified) ----
  class Signer {
    static encryptorPubKeyHex = "00c1e3934d1614465b33053e7f48ee4ec87b14b95ef88947713d25eecbff7e74c7977d02dc1d9451f79dd5d1c10c29acb6a9b4d6fb7d0a0279b6719e1772565f09af627715919221aef91899cae08c0d686d748b20a3603be2318ca6bc2b59706592a9219d0bf05c9f65023a21d2330807252ae0066d59ceefa5f2748ea80bab81";
    static encryptorPubKeyExp = "10001";

    static randUid() {
      let r = "";
      for (let i = 0; i < 4; i++) {
        r += ("0000" + Math.floor(65536 * (1 + Math.random())).toString(16)).slice(-4);
      }
      return r;
    }

    static encryptSymmetrical1(oText, randomStr) {
      const key = CryptoJS.enc.Utf8.parse(randomStr);
      const iv = CryptoJS.enc.Utf8.parse("0000000000000000");
      const encrypted = CryptoJS.AES.encrypt(oText, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      return CryptoJS.enc.Hex.stringify(encrypted.ciphertext);
    }

    static encryptAsymmetric1(message) {
      const rsa = new RSAKey();
      rsa.setPublic(Signer.encryptorPubKeyHex, Signer.encryptorPubKeyExp);
      const encrypted = rsa.encrypt(message);
      if (!encrypted) throw new Error("RSA encrypt failed");
      return encrypted;
    }

    static encryptW(rawInput, pt) {
      if (!pt || pt === "0") return encodeURIComponent(rawInput);
      const randomUid = Signer.randUid();
      if (pt === "1") {
        let encKey = Signer.encryptAsymmetric1(randomUid);
        let encInput = Signer.encryptSymmetrical1(rawInput, randomUid);
        return encInput + encKey;
      }
      throw new Error("Encryption pt=2 not implemented");
    }
  }

  // ---- Geeked class simplified ----
  class Geeked {
    constructor(captchaId) {
      this.captchaId = captchaId;
      this.challenge = crypto.randomUUID();
      this.callback = this.randomCallback();
      this.lotNumber = null;
    }

    randomCallback() {
      return `geetest_${Math.floor(Math.random() * 10000) + Date.now()}`;
    }

    async gmGet(url, params) {
      let urlObj = new URL(url);
      if (params) {
        Object.entries(params).forEach(([k,v]) => urlObj.searchParams.append(k,v));
      }
      let res = await gmFetch(urlObj.toString());
      let text = res.responseText;
      if (!text.startsWith(this.callback + "(")) throw new Error("Invalid callback prefix");
      let jsonStr = text.slice(this.callback.length + 1, -1);
      let json = JSON.parse(jsonStr);
      return json.data;
    }

    async loadCaptcha() {
      let params = {
        captcha_id: this.captchaId,
        challenge: this.challenge,
        client_type: "web",
        risk_type: "slide",
        lang: "eng",
        callback: this.callback,
      };
      return await this.gmGet("https://gcaptcha4.geevisit.com/load", params);
    }

    async submitCaptcha(data) {
      this.callback = this.randomCallback();

      let params = {
        callback: this.callback,
        captcha_id: this.captchaId,
        client_type: "web",
        lot_number: this.lotNumber,
        risk_type: "slide",
        payload: data.payload,
        process_token: data.process_token,
        payload_protocol: "1",
        pt: "1",
        w: Signer.encryptW(JSON.stringify(data), "1"),
      };
      let resData = await this.gmGet("https://gcaptcha4.geevisit.com/verify", params);
      if (!resData.seccode) throw new Error("Captcha submit failed: " + JSON.stringify(resData));
      return resData.seccode;
    }

    async solve() {
      let data = await this.loadCaptcha();
      this.lotNumber = data.lot_number;

      let left = await findPuzzlePiecePosition(
        `https://static.geetest.com/${data.slice}`,
        `https://static.geetest.com/${data.bg}`
      );
      left += Math.random() * 0.5;

      data.pt = "1";
      data.setLeft = left;
      data.passtime = Math.floor(Math.random() * 600) + 600;
      data.userresponse = left / 1.0059466666666665 + 2;

      let seccode = await this.submitCaptcha(data);
      return seccode;
    }
  }


  const input = document.querySelector('input[name="code"]');
  // Hàm gọi API giải captcha

  // Hàm đợi phần tử có nội dung (đợi #TK1)
  function waitForKeyword(selector, interval = 100) {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim() !== "") {
          clearInterval(timer);
          resolve(el.textContent.trim());
        }
      }, interval);
    });
  }


  // Hàm gọi API get-url cho color đỏ
  async function fetchUrl(site) {
    try {
      const response = await fetch("https://yeumoneytest.vercel.app/get-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site }),
      });
      const data = await response.json();
      if (typeof data === "object" && typeof data.url === "string" && data.url.startsWith("http")) {
        return data.url;
      } else {
        throw new Error("API trả về không đúng định dạng URL");
      }
    } catch (err) {
      console.error("Lỗi khi gọi API get-url:", err);
      throw err;
    }
  }

  // Hàm ẩn các phần tử không cần thiết
  function removeElements() {
    ["tf_gg", "tf_sp", "tf_dr", "vhd_gg", "vhd_dr"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

    document.querySelectorAll(
      ".header-section, .footer-section, .box-step-link.fadeInUp.visible, .box-step, .box-step-wrap"
    ).forEach((el) => {
      el.style.display = "none";
    });

    const input = document.querySelector('input[name="code"]');
    if (input) input.style.display = "none";

    const xacnhan = document.getElementById("btn-xac-nhan");
    if (xacnhan) xacnhan.style.display = "none";

    const baoloi = document.getElementById("btn-baoloi");
    if (baoloi) baoloi.style.display = "none";
  }

  // Hiển thị đếm ngược với pause/resume
  async function displayCountdown(totalSeconds, step, color, url) {
let container = document.querySelector(".box-step-container");
if (!container) {
  container = document.createElement("div");
  container.className = "box-step-container";
  container.style.padding = "20px";
  document.body.appendChild(container);
}
  const box = document.createElement("div");  // Đây phải là const hoặc let
  box.className = "box-step-wrap";
  box.id = `countdown-step-${step}`;
  container.appendChild(box);
    box.innerHTML = `
      <div class="countdown-container" id="countdown-container-${step}"></div>
      <div class="controls">
        <button id="pause-btn-${step}">Tạm dừng</button>
      </div>
    `;

    const pauseBtn = document.getElementById(`pause-btn-${step}`);
    let paused = false;
    let remainingTime = totalSeconds * 1000;
    let end = Date.now() + remainingTime;

    pauseBtn.onclick = () => {
      paused = !paused;
      pauseBtn.innerText = paused ? "Tiếp tục" : "Tạm dừng";
      if (paused) {
        remainingTime = end - Date.now();
      } else {
        end = Date.now() + remainingTime;
      }
    };

    return new Promise((resolve) => {
      function update() {
        if (paused) {
          requestAnimationFrame(update);
          return;
        }

        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((end - now) / 1000));
        const containerEl = document.getElementById(`countdown-container-${step}`);
        if (containerEl) {
          const progress = Math.min(
            100,
            ((totalSeconds * 1000 - remaining * 1000) / (totalSeconds * 1000)) * 100
          );

          containerEl.innerHTML = `
            <div class="countdown-text pulse-animation">
              <img src="https://cdn-icons-png.flaticon.com/512/888/888879.png" width="40" /><br>
              Màu: ${color === "xanh" ? "🔵 Xanh" : "🔴 Đỏ"}<br>
              URL: 🔗 <a href="${url}" target="_blank">${url}</a><br>
              Trạng thái: ${paused ? "⏸️ Tạm dừng" : "⏳ Đang xử lý..."}<br>
              ⏳ Bước ${step}: ${remaining}s
            </div>
            <div class="progress-container">
              <div id="progress-bar-${step}" class="progress-bar" style="width: ${progress}%;" data-tooltip="${progress.toFixed(0)}% - Còn ${remaining}s">
                ${progress.toFixed(0)}%
              </div>
            </div>
          `;
        }

        if (now < end) {
          requestAnimationFrame(update);
        } else {
          const containerEl = document.getElementById(`countdown-container-${step}`);
          if (containerEl) {
            containerEl.innerHTML = `
              <div class="countdown-text">
                ✅ <strong>Bước ${step} hoàn tất!</strong><br>
                Màu: ${color === "xanh" ? "🔵 Xanh" : "🔴 Đỏ"}<br>
                URL: 🔗 <a href="${url}" target="_blank">${url}</a><br>
                Trạng thái: ✅ Hoàn tất
              </div>
            `;
            box.style.backgroundColor = "#e6ffe6";
          }
          pauseBtn.disabled = true;
          pauseBtn.innerText = "Đã xong";
          resolve();
        }
      }
      update();
    });
  }

  // Theme và style setup
  function setupThemeAndStyle() {
    const themes = [
      { name: 'light', boxBg: '#fff', textColor: '#333', icon: '🌓' },
      { name: 'dark', boxBg: '#1e1e1e', textColor: '#eee', icon: '🌙' },
      { name: 'colorful', boxBg: '#ffe4e1', textColor: '#ff4500', icon: '🎨' },
      { name: 'blue', boxBg: '#e3f2fd', textColor: '#1565c0', icon: '💙' },
      { name: 'green', boxBg: '#e8f5e9', textColor: '#2e7d32', icon: '💚' }
    ];
    let currentTheme = parseInt(localStorage.getItem('currentTheme')) || 0;
    if (currentTheme >= themes.length) currentTheme = 0;
    document.documentElement.style.setProperty('--box-bg', themes[currentTheme].boxBg);
    document.documentElement.style.setProperty('--text-color', themes[currentTheme].textColor);

    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes bounceIn {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      .box-step-wrap {
        animation: bounceIn 0.5s ease-out;
        background: var(--box-bg, #fff);
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-bottom: 20px;
        transition: opacity 0.3s ease;
        max-width: 600px;
        margin: auto;
      }
      .box-step-wrap .pulse-animation {
        animation: pulse 1.5s infinite;
      }
      .progress-container {
        height: 20px;
        width: 100%;
        background: #eee;
        margin-top: 10px;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
      }
      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--text-color, #333), #fff, var(--text-color, #333));
        background-size: 200% 200%;
        animation: gradientMove 3s linear infinite;
        border-radius: 10px;
        transition: width 0.3s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 12px;
        font-weight: bold;
        position: relative;
      }
      .progress-bar:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 10;
      }
      .countdown-text {
        font-size: 24px;
        font-weight: bold;
        line-height: 1.5;
        color: var(--text-color, #333);
        text-align: center;
      }
      .countdown-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .controls {
        margin-top: 10px;
        text-align: center;
      }
      .controls button {
        background: #4CAF50;
        color: #fff;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin: 0 5px;
      }
      .controls button:hover {
        background: #45a049;
      }
      @media (max-width: 600px) {
        .countdown-text {
          font-size: 18px;
        }
        .box-step-wrap {
          padding: 15px;
        }
        .progress-container {
          height: 25px;
        }
        .progress-bar {
          font-size: 10px;
        }
      }
      @media (max-width: 400px) {
        .countdown-text {
          font-size: 16px;
        }
        .box-step-wrap {
          padding: 10px;
        }
        .progress-container {
          height: 20px;
        }
        .progress-bar {
          font-size: 8px;
        }
      }
      .theme-toggle {
        position: fixed;
        top: 10px;
        right: 10px;
        background: #000;
        color: #fff;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 9999;
      }
    `;
    document.head.appendChild(style);

    // Theme Toggle Button
    const themeBtn = document.createElement("button");
    themeBtn.className = "theme-toggle";
    themeBtn.innerText = themes[currentTheme].icon;
    themeBtn.onclick = () => {
      currentTheme = (currentTheme + 1) % themes.length;
      const theme = themes[currentTheme];
      document.documentElement.style.setProperty('--box-bg', theme.boxBg);
      document.documentElement.style.setProperty('--text-color', theme.textColor);
      themeBtn.innerText = theme.icon;
      localStorage.setItem('currentTheme', currentTheme);
    };
    document.body.appendChild(themeBtn);
  }

  // Main xử lý chính
  async function main() {
    removeElements();
    setupThemeAndStyle();
    let site_key, color_choice, selected_url;
    const heading = document.querySelector("div.heading.-lv2.fadeInUp.visible > h2");
    const tk1Element = document.querySelector("p.box-copy-code#TK1");

    if (tk1Element) {
      site_key = tk1Element.textContent.trim().toLowerCase().replace(/\s+/g, " ");
    } else {
      throw new Error("Không tìm thấy #TK1");
    }

    if (site_key.startsWith("http")) {
      color_choice = "xanh";
      selected_url = site_key;
    } else {
      color_choice = "đỏ";
      selected_url = await fetchUrl(site_key);
    }

    if (heading) {
      heading.innerHTML = `Màu: ${color_choice === "xanh" ? "🔵 Xanh" : "🔴 Đỏ"}<br>URL: ${selected_url}<br>Status: Đang khởi động`;
    }

    let endpoint;
    if (color_choice === "xanh") {
      endpoint = "https://data-abc.com/embed/direct.php";
    } else {
      endpoint = "https://data-abc.com/embed/google.php";
    }

    function getTokenAndCountdown(text) {
  // Parse chuỗi HTML thành DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");

  const tokenMatch = text.match(/data-token="([^"]+)"/);
  const cdMatch = text.match(/data-countdown="(\d+)"/);

  // Lấy element chứa data-captcha-id
  const element = doc.querySelector("[data-captcha-id]");
  const captchaId = element ? element.getAttribute("data-captcha-id") : null;

  return {
    token: tokenMatch ? tokenMatch[1] : null,
    countdown: cdMatch ? parseInt(cdMatch[1]) : 0,
    captchaId: captchaId,
  };
}


    function postAndGetToken(token = "", captchatoken = null, container = "") {
      return fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: "",
          currentUrl: selected_url,
          referrerUrl: "https://www.google.com/",
          container: "",
          token,
          init: 0,
          ...(captchatoken && {gee_data: captchatoken }),
        }),
      }).then((res) => res.text().then((data) => ({ data })));
    }

    try {

      // Bước 1
      let res = await postAndGetToken();
      let { token, countdown } = getTokenAndCountdown(res.data);
      if (!token) throw new Error("Không tìm thấy token ở bước 1");
      if (countdown) await displayCountdown(countdown, 1, color_choice, selected_url);

      // Bước 2
      res = await postAndGetToken(token);
      ({ token, countdown } = getTokenAndCountdown(res.data));
      if (!token) throw new Error("Không tìm thấy token ở bước 2");
      if (countdown) await displayCountdown(countdown, 2, color_choice, selected_url);

      // Bước 3: lấy token, apiEndpoint
      res = await postAndGetToken(token);
      let captchaId;
      ({ token, captchaId  } = getTokenAndCountdown(res.data));
      if (!token) throw new Error("Không tìm thấy token ở bước 3");
      const solver = new Geeked(captchaId);
      const seccode = await solver.solve();
      console.log("Captcha solved seccode:", seccode);
      // Sau khi giải captcha, gửi tiếp token + cap_token để nhận code
      res = await postAndGetToken(token, seccode);
      console.log(res)

      // Tìm mã code trong html trả về
      const matchCode = res.data.match(/<span class="ymn-btn-text">\s*(\d+)\s*<\/span>/);
      if (matchCode) {
        const code = matchCode[1];
        if (heading)
          heading.innerHTML = `Mã CAPTCHA: ${code}<br>Status: Hoàn tất`;
        if (input) input.value = code;

        const form = document.getElementById("gt-form");
        if (form) form.submit();
      } else {
        throw new Error("Không tìm thấy mã CAPTCHA trong response cuối.");
      }
    } catch (err) {
      console.error("❌ Lỗi:", err.message);
      const heading = document.querySelector("div.heading.-lv2.fadeInUp.visible > h2");
      if (heading)
        heading.innerHTML = `Lỗi: ${err.message}<br>Status: Thất bại`;
    }
  }

  // Khởi chạy khi phát hiện #TK1 có nội dung
  (async () => {
    await waitForKeyword("#TK1");
    await main();
  })();
})();
