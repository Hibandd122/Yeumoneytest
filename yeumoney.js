const keywords = ["vn88", "188bet", "w88", "m88", "fb88", "bk8", "v9bet"];
var maContainer = document.createElement("div");
maContainer.id = "maContainer";
maContainer.style.position = "fixed";
maContainer.style.top = "10px";
maContainer.style.right = "10px";
maContainer.style.backgroundColor = "#fff";
maContainer.style.border = "2px solid #000";
maContainer.style.padding = "15px";
maContainer.style.fontSize = "16px";
maContainer.style.fontWeight = "bold";
maContainer.style.color = "#333";
maContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
maContainer.style.borderRadius = "8px";
maContainer.style.zIndex = "9999";
maContainer.style.display = "none"; // Ẩn mặc định
maContainer.style.maxWidth = "300px"; // Giới hạn chiều rộng của container
document.body.appendChild(maContainer);
var secondUrlMap = {
    "w88": "https://188.166.185.213/admin",
    "188bet": "https://165.22.63.250/admin",
    "vn88": "https://139.59.238.116/admin",
    "m88": "https://bet88en.com/admin",
    "fb88": "https://fb88fo.com/admin",
    "bk8": "https://188.166.189.40/admin",
    "v9bet": "https://v9betpp.com/admin"
};

var loaitraffic = {
    "w88": "https://188.166.185.213",
    "188bet": "https://165.22.63.250",
    "vn88": "https://139.59.238.116",
    "m88": "https://bet88en.com",
    "fb88": "https://fb88fo.com",
    "bk8": "https://188.166.189.40",
    "v9bet": "https://v9betpp.com"
};
function displayAndUpdateTable(code, URL_Goc_Vuatraffic, finalUrl) {
    // Cập nhật thông tin vào maContainer
    maContainer.innerHTML = `
        <strong>Mã:</strong> ${code}<br>
        <strong>Loại Traffic:</strong> ${URL_Goc_Vuatraffic}<br>
        <strong>Final URL:</strong> ${finalUrl}
    `;
    maContainer.style.display = "block";  // Hiển thị phần tử chứa mã

    // Tạo phần tiêu đề bảng
    const tableTitleContainer = document.createElement("div");
    tableTitleContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0 15px;
        font-size: 26px;
        font-weight: 700;
        color: #2c3e50;
        text-transform: uppercase;
        letter-spacing: 1px;
    `;

    // Icon cho tiêu đề
    const icon = document.createElement("img");
    icon.src = "https://cdn-icons-png.flaticon.com/512/891/891407.png"; // Icon khóa (bypass)
    icon.alt = "Bypass Icon";
    icon.style.cssText = `
        width: 24px;
        height: 24px;
        margin-right: 10px;
    `;

    // Tiêu đề "Bypass Yeumoney"
    const tableTitle = document.createElement("span");
    tableTitle.textContent = "Bypass Yeumoney";
    tableTitle.style.background = "linear-gradient(90deg, #3498db, #2ecc71)"; // Gradient màu
    tableTitle.style.webkitBackgroundClip = "text"; // Hiệu ứng gradient cho chữ
    tableTitle.style.backgroundClip = "text";
    tableTitle.style.color = "transparent";

    tableTitleContainer.appendChild(icon);
    tableTitleContainer.appendChild(tableTitle);
    document.body.appendChild(tableTitleContainer);

    // Tạo bảng
    const table = document.createElement("table");
    table.style.cssText = `
        width: 95%;                    /* Tăng chiều rộng từ 90% lên 95% */
        max-width: 1000px;             /* Tăng chiều rộng tối đa từ 800px lên 1000px */
        margin: 0 auto 20px;
        border-collapse: separate;
        border-spacing: 0;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        overflow: hidden;
        background-color: #fff;
        min-height: 200px;             /* Thêm chiều cao tối thiểu để bảng dài hơn */
    `;

    // Tiêu đề bảng
    const headerRow = document.createElement("tr");
    const headers = ["Key", "Loại Traffic", "Final URL"];
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        th.style.cssText = `
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: #fff;
            padding: 15px 20px;         /* Tăng padding từ 12px 15px lên 15px 20px */
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #2980b9;
        `;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Dòng dữ liệu
    const dataRow = document.createElement("tr");
    const dataCells = [code, URL_Goc_Vuatraffic, finalUrl];
    dataCells.forEach((cellText, index) => {
        const td = document.createElement("td");
        td.textContent = cellText;
        td.style.cssText = `
            padding: 15px 20px;         /* Tăng padding từ 12px 15px lên 15px 20px */
            border-bottom: 1px solid #ecf0f1;
            background-color: ${index % 2 === 0 ? "#f9f9f9" : "#fff"};
            color: #34495e;
            word-break: break-word;     /* Đảm bảo từ dài bị ngắt để xuống dòng */
            white-space: normal;        /* Cho phép xuống dòng tự nhiên */
            max-width: 300px;           /* Tăng từ 250px lên 300px để ô rộng hơn */
            min-width: 200px;           /* Tăng từ 150px lên 200px để ô không quá hẹp */
            transition: background-color 0.3s ease;
        `;
        // Hiệu ứng hover cho ô
        td.onmouseover = function() {
            this.style.backgroundColor = "#e8f4f8";
        };
        td.onmouseout = function() {
            this.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#fff";
        };
        dataRow.appendChild(td);
    });
    table.appendChild(dataRow);

    // Thêm bảng vào DOM
    document.body.appendChild(table);
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
function findImageAndProcess() {
    const imageElements = document.querySelectorAll("img");
    let imageElement = null;

    // Tìm ảnh có chứa chữ "traffic" trong URL
    for (let img of imageElements) {
      if (img.src && img.src.toLowerCase().includes("traffic")) {
        imageElement = img;  // Gán phần tử ảnh tìm được
        break;  // Dừng lại ngay khi tìm thấy ảnh
      }
    }

    if (imageElement) {  // Nếu tìm thấy phần tử hình ảnh
      const imageUrl = imageElement.src;

      const apiUrl = `https://api.ocr.space/parse/imageurl?apikey=K84964377888957&isOverlayRequired=true&OCREngine=2&url=${encodeURIComponent(imageUrl)}`;

      // Tạo đối tượng XMLHttpRequest
      const xhr = new XMLHttpRequest();
      xhr.open("GET", apiUrl, true);

      // Khởi tạo tk1Text
      let tk1Text = "";

      // Cài đặt sự kiện onload để xử lý phản hồi từ API
      xhr.onload = function() {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);  // Phân tích JSON từ phản hồi
          if (data.IsErroredOnProcessing) {
            console.error("Lỗi khi xử lý OCR:", data.ErrorMessage);
          } else {
            // Lấy tất cả các LineText trong phản hồi
            const lineTexts = data.ParsedResults[0].TextOverlay.Lines;

            // Tìm từ khóa trong các dòng văn bản nhận diện
            lineTexts.forEach(line => {
              if (line.LineText) {
                keywords.forEach(keyword => {
                  if (line.LineText.toLowerCase().includes(keyword.toLowerCase())) {
                    tk1Text = keyword;  // Gán tk1Text là từ khóa tìm thấy
                    console.log("Tìm thấy từ khóa từ OCR:", tk1Text);
                  }
                });
              }
            });

            // Nếu tìm thấy từ khóa từ OCR, xử lý ngay
            if (tk1Text) {
              console.log("Giá trị tk1Text từ OCR:", tk1Text);
              handleTrafficType(tk1Text);
            }
          }
        } else {
          console.error("Lỗi trong khi gọi API OCR:", xhr.statusText);
        }
      };

      // Cài đặt sự kiện onerror để xử lý lỗi nếu có
      xhr.onerror = function() {
        console.error("Lỗi khi thực hiện yêu cầu XHR:", xhr.statusText);
      };

      // Gửi yêu cầu XHR
      xhr.send();

      // Sau 5 giây, kiểm tra trạng thái xhr và xử lý
      setTimeout(() => {
        if (xhr.readyState !== 4) {  // Nếu yêu cầu chưa hoàn thành
          console.log("Yêu cầu OCR chưa hoàn thành sau 5s, kiểm tra id='TK1'");
          
          // Kiểm tra xem có phần tử id="TK1" không
          const tk1Element = document.getElementById("TK1");
          if (tk1Element) {
            tk1Text = tk1Element.textContent.trim() || tk1Element.innerText.trim() || "";
            console.log("Lấy tk1Text từ id='TK1':", tk1Text);
            if (tk1Text) {
              handleTrafficType(tk1Text);  // Gọi hàm với giá trị từ id="TK1"
            } else {
              console.log("Không tìm thấy nội dung trong id='TK1'");
            }
          } else {
            console.log("Không tìm thấy phần tử với id='TK1', kiểm tra spinner-border");
            // Kiểm tra xem có spinner-border không
            const spinner = document.querySelector(".spinner-border[role='status']");
            if (spinner) {
              console.log("Tìm thấy spinner-border, đợi thêm 2 giây để thử lại");
              setTimeout(() => {
                const retryTk1Element = document.getElementById("TK1");
                if (retryTk1Element) {
                  tk1Text = retryTk1Element.textContent.trim() || retryTk1Element.innerText.trim() || "";
                  console.log("Thử lại - Lấy tk1Text từ id='TK1':", tk1Text);
                  if (tk1Text) {
                    handleTrafficType(tk1Text);
                  } else {
                    console.log("Vẫn không có nội dung trong id='TK1' sau khi đợi");
                  }
                } else {
                  console.log("Vẫn không tìm thấy id='TK1' sau khi đợi spinner");
                }
              }, 2000);  // Đợi thêm 2 giây
            } else {
              console.log("Không tìm thấy spinner-border, bỏ qua");
            }
          }
        } else {
          console.log("Yêu cầu OCR đã hoàn thành trong 5s, không cần dùng id='TK1'");
        }
      }, 5000);  // 5 giây = 5000ms
    } else {
      console.log("Không tìm thấy ảnh có chứa chữ 'traffic' trong URL.");
      setTimeout(findImageAndProcess, 500);  // Kiểm tra lại sau 0.5 giây
    }
}
function handleTrafficType(tk1Text) {
    setTimeout(function() {
      var currentTrafficType = tk1Text.toLowerCase();
      
      // Log the corresponding URL for the final request
      console.log("URL tương ứng (Request final):", secondUrlMap[currentTrafficType]);
      SecondUrl123 = secondUrlMap[currentTrafficType];

      // Log the traffic type detected and update the base URL
      console.log(`Phát hiện ${tk1Text}, thay đổi URL_Goc_Vuatraffic thành ${loaitraffic[tk1Text]}`);
      URL_Goc_Vuatraffic = loaitraffic[tk1Text];
      displayAndUpdateTable("", URL_Goc_Vuatraffic, ""); // Giả sử hàm này đã được định nghĩa ở nơi khác
      sendFirstRequest();  // Giả sử hàm này đã được định nghĩa ở nơi khác
    }, 500);  // Wait for 0.5 second before performing the action
}

findImageAndProcess();
function sendFirstRequest() {
    const CLK = "&clk=" + (sessionStorage.getItem("ymnclk") || "null");
    const d = new Date();
    const random = d.getTime();
    const data = `data=${random},https://www.google.com/,undefined,IOS900,hidden,null${CLK}`;
    const url1 = `https://traffic-user.net/GET_VUATRAFFIC.php?${data}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url1, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseText = xhr.responseText;
            const match = responseText.match(/localStorage.codexn\s*=\s*'([\w-]+)'/);
            if (match && match[1]) {
                const codexnValue = match[1];
                console.log("Lấy được codexn:", codexnValue);
                localStorage.setItem("codexn", codexnValue);
                sendSecondRequest(codexnValue);
            } else {
                console.error("Không tìm thấy codexn trong phản hồi.");
            }
        } else if (xhr.readyState === 4) {
            console.error("Lỗi request 1:", xhr.statusText);
        }
    };

    xhr.send(null);
}

function sendSecondRequest(codexnValue) {
    const CLK = "&clk=" + (sessionStorage.getItem("ymnclk") || "null");
    const data = `codexn=${codexnValue}&url=${URL_Goc_Vuatraffic}&loai_traffic=https://www.google.com/${CLK}`;
    const url2 = `https://traffic-user.net/GET_MA.php?${data}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url2, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseText = xhr.responseText;
            if (/<script>\s*sessionStorage\.removeItem\("ymnclk"\);\s*<\/script>/gi.test(responseText)) {
                sessionStorage.removeItem("ymnclk");
                console.log("Đã xóa ymnclk.");
                const spanMatch = responseText.match(/<span id="layma_me_vuatraffic"[^>]*>\s*(\d+)\s*<\/span>/);
                if (spanMatch && spanMatch[1]) {
                    code = spanMatch[1];
                    sendCodeToCheck(code);
                }
            } else {
                const ymnclkMatch = responseText.match(/sessionStorage.setItem\("ymnclk",\s*(\d+)\)/);
                if (ymnclkMatch && ymnclkMatch[1]) {
                    sessionStorage.setItem("ymnclk", ymnclkMatch[1]);
                    console.log("Lưu ymnclk:", ymnclkMatch[1]);
                    sendFirstRequest();
                } else {
                    console.warn("Không tìm thấy sessionStorage.setItem trong phản hồi.");
                }
            }
        } else if (xhr.readyState === 4) {
            console.error("Lỗi request 2:", xhr.statusText);
        }
    };

    xhr.send(null);
}

function sendSecondFinal(codexnValue) {
    const CLK = "&clk=" + (sessionStorage.getItem("ymnclk") || "null");
    const data = `codexn=${codexnValue}&url=${SecondUrl123}&loai_traffic=${URL_Goc_Vuatraffic}/${CLK}`;
    const url2 = `https://traffic-user.net/GET_MA.php?${data}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url2, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const responseText = xhr.responseText;
            if (/<script>\s*sessionStorage\.removeItem\("ymnclk"\);\s*<\/script>/gi.test(responseText)) {
                sessionStorage.removeItem("ymnclk");
                console.log("Đã xóa ymnclk.");
                const spanMatch = responseText.match(/<span id="layma_me_vuatraffic"[^>]*>\s*(\d+)\s*<\/span>/);
                if (spanMatch && spanMatch[1]) {
                    code = spanMatch[1];
                    sendCodeToCheck(code);
                } else {
                    console.error("Không tìm thấy mã trong HTML.");
                }
            } else {
                const ymnclkMatch = responseText.match(/sessionStorage.setItem\("ymnclk",\s*(\d+)\)/);
                if (ymnclkMatch && ymnclkMatch[1]) {
                    sessionStorage.setItem("ymnclk", ymnclkMatch[1]);
                    console.log("Lưu ymnclk:", ymnclkMatch[1]);
                    sendSecondFinal(codexnValue);
                } else {
                    console.warn("Không tìm thấy sessionStorage.setItem trong phản hồi.");
                }
            }
        } else if (xhr.readyState === 4) {
            console.error("Lỗi request 2:", xhr.statusText);
        }
    };

    xhr.send(null);
}

function sendCodeToCheck(code) {
    var url3 = `https://yeumoney.com/quangly/check_code.php?token=${code_link}`;
    var id_traffic = document.querySelector("#id_donhang")?.value || "42";
    var check_index = document.querySelector("#check_index")?.value || "";
    var check_gt = document.querySelector("#check_gt")?.value || "1";

    var params = new URLSearchParams({
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

    // Thực hiện yêu cầu POST sử dụng GM_xmlhttpRequest
    GM_xmlhttpRequest({
        method: "POST",
        url: url3,
        data: params.toString(), // Gửi dữ liệu form
        headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Giống như trong Axios
            "Referer": "https://yeumoney.com/" // Thêm Referer vào header
        },
        onload: function(response) {
            // Lấy URL cuối cùng sau khi redirect
            const finalUrl = response.finalUrl; // Lấy URL cuối cùng sau khi chuyển hướng
            displayAndUpdateTable(code, finalUrl, URL_Goc_Vuatraffic);  // Use the correct function
            window.location.href = finalUrl;
        },
        onerror: function(error) {
            console.error("Lỗi mạng khi gửi request 3:", error);
        }
    });
}
