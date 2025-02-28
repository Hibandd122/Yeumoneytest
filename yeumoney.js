const keywords = ["vn88", "188bet", "w88", "m88", "fb88", "bk8", "v9bet"];
var maContainer = document.createElement("div");
maContainer.id = "maContainer";
maContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #f4f6f9;
    padding: 50px;
    font-size: 28px;
    font-weight: bold;
    color: #333;
    z-index: 9999;
    display: block;
    overflow: auto;
    text-align: center;
`;
document.body.appendChild(maContainer);

function displayAndUpdateTable(status, code, keyword, URL_Goc_Vuatraffic, finalUrl) {
    maContainer.innerHTML = '';

    const table = document.createElement("table");
    table.style.cssText = `
        width: 80%;
        max-width: 1200px;
        margin: auto;
        border-collapse: collapse;
        font-family: 'Arial', sans-serif;
        background-color: #fff;
        font-size: 24px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        overflow: hidden;
    `;

    const headers = ["Status", "Mã", "Từ khoá", "Loại Traffic"];
    const headerRow = document.createElement("tr");
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        th.style.cssText = `
            background: linear-gradient(135deg, #3498db, #2ecc71);
            color: #fff;
            padding: 18px;
            text-transform: uppercase;
        `;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const dataRow = document.createElement("tr");
    [status, code, keyword, URL_Goc_Vuatraffic].forEach((cellText, index) => {
        const td = document.createElement("td");
        td.textContent = cellText;
        td.style.cssText = `
            padding: 20px;
            border: 1px solid #ddd;
            background-color: ${index % 2 === 0 ? "#f9f9f9" : "#fff"};
            font-size: 24px;
            font-weight: 600;
        `;
        dataRow.appendChild(td);
    });
    table.appendChild(dataRow);

    const finalUrlRow = document.createElement("tr");
    const finalUrlTd = document.createElement("td");
    finalUrlTd.colSpan = 4;
    finalUrlTd.textContent = `Final URL: ${finalUrl}`;
    finalUrlTd.style.cssText = `
        padding: 20px;
        border: 1px solid #ddd;
        background-color: #ffeb3b;
        color: #d32f2f;
        font-size: 24px;
        font-weight: 600;
        text-align: center;
    `;
    finalUrlRow.appendChild(finalUrlTd);
    table.appendChild(finalUrlRow);

    maContainer.appendChild(table);

    // Checkbox Auto Redirect
    const label = document.createElement("label");
    label.style.display = "block";
    label.style.marginTop = "20px";
    label.style.fontSize = "20px";
    label.style.color = "#333";
    label.textContent = "Tự động chuyển hướng: ";
    if (localStorage.getItem("autoRedirect") === null) {
      localStorage.setItem("autoRedirect", "true");
    }

    const autoRedirectCheckbox = document.createElement("input");
    autoRedirectCheckbox.type = "checkbox";
    autoRedirectCheckbox.checked = localStorage.getItem("autoRedirect") === "true";
    autoRedirectCheckbox.addEventListener("change", () => {
        localStorage.setItem("autoRedirect", autoRedirectCheckbox.checked);
    });

    label.appendChild(autoRedirectCheckbox);
    maContainer.appendChild(label);
}

var URL_Goc_Vuatraffic = "";
var code_link = "";

// Lấy mã liên kết từ script
var scriptElements = document.getElementsByTagName("script");
for (var script of scriptElements) {
    var match = script.textContent.match(/var code_link = \"(.*?)\";/);
    if (match) {
        code_link = match[1];
        break;
    }
}
function findKeywork() {
  displayAndUpdateTable("Đang tìm nhiệm vụ", "", "", "", "")
  function checkTK1() {
      const tk1Element = document.getElementById("TK1");
      if (tk1Element) {
          const tk1Text = tk1Element.textContent.trim();
          Text123 = tk1Text
          if (tk1Text) {
              console.log("Lấy tk1Text:", tk1Text);
              handleTrafficType(tk1Text);
              return; // Thoát khi tìm thấy dữ liệu hợp lệ
          }
      }

      setTimeout(checkTK1, 500); // Tiếp tục kiểm tra sau 0.5 giây
  }

  checkTK1(); // Bắt đầu kiểm tra
}
var urlMap = {
  "w88": "https://188.166.185.213",
  "188bet": "https://165.22.63.250",
  "vn88": "https://139.59.238.116",
  "m88": "https://bet88se.com",
  "fb88": "https://fb88ik.com",
  "bk8": "https://188.166.189.40",
  "v9bet": "https://v9betog.com"
};

function handleTrafficType(tk1Text) {
    setTimeout(function() {

        var currentTrafficType = tk1Text.toLowerCase();
        URL_Goc_Vuatraffic = urlMap[currentTrafficType];
        displayAndUpdateTable("Đang get mã", "", tk1Text, URL_Goc_Vuatraffic, "")
        startBypass(URL_Goc_Vuatraffic);
    }, 500);
}

findKeywork()

function sendFirstRequest(ymnclk) {
  return new Promise((resolve, reject) => {
      const random = Date.now();
      const data = `data=${random},https://www.google.com/,undefined,IOS900,hidden,null&clk=${ymnclk}`;
      const url1 = `https://traffic-user.net/GET_VUATRAFFIC.php?${data}`;

      const xhr = new XMLHttpRequest();
      xhr.open("POST", url1, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                  const responseText = xhr.responseText;
                  const match = responseText.match(/localStorage.codexn\s*=\s*'([\w-]+)'/);
                  if (match && match[1]) {
                      resolve(match[1]);
                  } else {
                      displayAndUpdateTable("Lỗi codexn", code, Text123, url, finalUrl);
                      reject("No codexn found");
                  }
              } else {
                  reject(xhr.statusText);
              }
          }
      };
      xhr.send(null);
  });
}

function sendSecondRequest(URL_Goc_Vuatraffic, codexnValue, ymnclk) {
  return new Promise((resolve, reject) => {
      const data = `codexn=${codexnValue}&url=${URL_Goc_Vuatraffic}&loai_traffic=https://www.google.com/&clk=${ymnclk}`;
      const url2 = `https://traffic-user.net/GET_MA.php?${data}`;

      const xhr = new XMLHttpRequest();
      xhr.open("POST", url2, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                  const responseText = xhr.responseText;
                  if (/<script>\s*sessionStorage\.removeItem\("ymnclk"\);\s*<\/script>/gi.test(responseText)) {
                      sessionStorage.removeItem("ymnclk");
                      const spanMatch = responseText.match(/<span id="layma_me_vuatraffic"[^>]*>\s*(\d+)\s*<\/span>/);
                      if (spanMatch && spanMatch[1]) {
                          sendCodeToCheck(spanMatch[1]);
                      }
                  } else {
                      const ymnclkMatch = responseText.match(/sessionStorage.setItem\("ymnclk",\s*(\d+)\)/);
                      if (ymnclkMatch && ymnclkMatch[1]) {
                          resolve(ymnclkMatch[1]);
                      } else {
                          displayAndUpdateTable("Lỗi ymnclk", code, Text123, url, finalUrl);
                          reject("No ymnclk found");
                      }
                  }
              } else {
                  reject(xhr.statusText);
              }
          }
      };
      xhr.send(null);
  });
}

function sendCodeToCheck(code) {
  const url3 = `https://yeumoney.com/quangly/check_code.php?token=${code_link}`;
  const id_traffic = document.querySelector("#id_donhang")?.value;
  const check_index = document.querySelector("#check_index")?.value;
  const check_gt = document.querySelector("#check_gt")?.value;

  const params = new URLSearchParams({
      code: code,
      keyword: "",
      dieuhanh: "Win32",
      pix: "1920x1080",
      lvp: "100",
      CHAN_ADS: "Block",
      ref: "$ref",
      trinhduyet: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36|1920 x 1080|Win32",
      id_traffic: id_traffic,
      check_index: check_index,
      check_gt: check_gt
  });

  GM_xmlhttpRequest({
      method: "POST",
      url: url3,
      data: params.toString(),
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Referer": "https://yeumoney.com/"
      },
      onload: function(response) {
          finalUrl = response.finalUrl
          displayAndUpdateTable("Hoàn thành", code, Text123, URL_Goc_Vuatraffic, finalUrl);
          if (localStorage.getItem("autoRedirect") === "true") {
              window.location.href = finalUrl;
          }
      },
      onerror: function(error) {}
  });
}


async function startBypass(URL_Goc_Vuatraffic) {
  try {
      const codexnValue1 = await sendFirstRequest(null);
      const ymnclk1 = await sendSecondRequest(URL_Goc_Vuatraffic, codexnValue1, null);
      const codexnValue2 = await sendFirstRequest(ymnclk1);
      const url = URL_Goc_Vuatraffic + "/admin";
      const ymnclk2 = await sendSecondRequest(url, codexnValue2, ymnclk1);
      displayAndUpdateTable("Hoàn thành", code, Text123, url, finalUrl);
  } catch (error) {
      displayAndUpdateTable("Lỗi", "", "", "", "Không lấy được URL");
      return null;
  }
}
