// ==UserScript==
// @name         Yeumoney Traffic Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gửi mã kiểm tra và thao tác với traffic từ Yeumoney
// @author       Hibandd122
// @match        https://yeumoney.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @run-at       document-end
// ==/UserScript==
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

    // Tạo phần tên bảng (Bypass Yeumoney) với icon
    const tableTitleContainer = document.createElement("div");
    tableTitleContainer.style.display = "flex";
    tableTitleContainer.style.alignItems = "center";
    tableTitleContainer.style.marginBottom = "15px"; // Tạo khoảng cách dưới tên bảng
    tableTitleContainer.style.fontSize = "24px";
    tableTitleContainer.style.fontWeight = "bold";

    // Tạo icon (có thể dùng Font Awesome hoặc một hình ảnh tùy ý)
    const icon = document.createElement("img");
    icon.src = "https://via.placeholder.com/20";  // Thay thế bằng URL của icon bạn muốn
    icon.alt = "Icon";
    icon.style.marginRight = "10px";  // Khoảng cách giữa icon và text

    // Tạo tên bảng "Bypass Yeumoney"
    const tableTitle = document.createElement("span");
    tableTitle.textContent = "Bypass Yeumoney";
    tableTitle.style.color = "#4CAF50";  // Màu xanh lá cho tiêu đề

    tableTitleContainer.appendChild(icon);
    tableTitleContainer.appendChild(tableTitle);

    // Thêm phần tên bảng vào DOM
    document.body.appendChild(tableTitleContainer);

    // Tạo bảng
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.maxWidth = "100%";  // Cho phép bảng rộng hết có thể
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "20px";  // Khoảng cách giữa maContainer và bảng
    table.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    table.style.tableLayout = "auto";  // Auto adjust the width to fit the content

    // Thêm tiêu đề bảng
    const headerRow = document.createElement("tr");
    const headers = ["Key", "Loại Traffic", "Final URL"];
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.style.border = "1px solid #ddd";
        th.style.padding = "10px";
        th.style.textAlign = "left";
        th.style.backgroundColor = "#4CAF50";
        th.style.color = "#fff";
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Thêm dòng dữ liệu
    const dataRow = document.createElement("tr");

    // Cột "Key"
    const keyCell = document.createElement("td");
    keyCell.style.border = "1px solid #ddd";
    keyCell.style.padding = "8px";
    keyCell.style.backgroundColor = "#f9f9f9";
    keyCell.textContent = code;
    dataRow.appendChild(keyCell);

    // Cột "Loại Traffic"
    const loaitrafficCell = document.createElement("td");
    loaitrafficCell.style.border = "1px solid #ddd";
    loaitrafficCell.style.padding = "8px";
    loaitrafficCell.style.backgroundColor = "#f9f9f9";
    loaitrafficCell.style.wordWrap = "break-word";  // Cho phép text xuống dòng khi dài
    loaitrafficCell.style.whiteSpace = "normal";     // Allow text to break into multiple lines
    loaitrafficCell.style.minWidth = "200px";  // Set a minimum width to make sure column is wide enough
    loaitrafficCell.textContent = URL_Goc_Vuatraffic;
    dataRow.appendChild(loaitrafficCell);

    // Cột "Final URL"
    const finalUrlCell = document.createElement("td");
    finalUrlCell.style.border = "1px solid #ddd";
    finalUrlCell.style.padding = "8px";
    finalUrlCell.style.backgroundColor = "#f9f9f9";
    finalUrlCell.style.wordWrap = "break-word";  // Allow wrapping of long text
    finalUrlCell.style.whiteSpace = "normal";     // Allow text to break into multiple lines
    finalUrlCell.style.minWidth = "200px";  // Set a minimum width for this column
    finalUrlCell.textContent = finalUrl;
    dataRow.appendChild(finalUrlCell);

    table.appendChild(dataRow);

    // Thêm bảng vào DOM (thêm vào body của trang)
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

// Hàm tìm kiếm ảnh và gọi OCR liên tục
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

      // Cài đặt sự kiện onload để xử lý phản hồi từ API
      xhr.onload = function() {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);  // Phân tích JSON từ phản hồi
          if (data.IsErroredOnProcessing) {
            console.error("Lỗi khi xử lý OCR:", data.ErrorMessage);  // Nếu có lỗi trong quá trình xử lý
          } else {
            // Lấy tất cả các LineText trong phản hồi
            const lineTexts = data.ParsedResults[0].TextOverlay.Lines;

            // Tìm từ khóa trong các dòng văn bản nhận diện
            let tk1Text = "";  // Khởi tạo tk1Text
            lineTexts.forEach(line => {
              if (line.LineText) {
                keywords.forEach(keyword => {
                  if (line.LineText.toLowerCase().includes(keyword.toLowerCase())) {
                    tk1Text = keyword;  // Gán tk1Text là từ khóa tìm thấy
                    console.log("Tìm thấy từ khóa:", tk1Text);  // In từ khóa tìm thấy
                  }
                });
              }
            });

            // Kiểm tra nếu đã tìm thấy từ khóa và thực hiện hành động
            if (tk1Text) {
              console.log("Giá trị tk1Text:", tk1Text);
              handleTrafficType(tk1Text);  // Gọi hàm xử lý loại traffic
            }
          }
        } else {
          console.error("Lỗi trong khi gọi API OCR:", xhr.statusText);  // Nếu có lỗi khi gọi API
        }
      };

      // Cài đặt sự kiện onerror để xử lý lỗi nếu có
      xhr.onerror = function() {
        console.error("Lỗi khi thực hiện yêu cầu XHR:", xhr.statusText);  // Lỗi khi thực hiện yêu cầu
      };

      // Gửi yêu cầu XHR
      xhr.send();
    } else {
      console.log("Không tìm thấy ảnh có chứa chữ 'traffic' trong URL.");
      // Nếu không tìm thấy ảnh, tiếp tục kiểm tra lại sau một khoảng thời gian (tùy chọn)
      setTimeout(findImageAndProcess, 500);  // Kiểm tra lại sau 1 giây
    }
  }

// Hàm xử lý loại traffic dựa trên tk1Text
function handleTrafficType(tk1Text) {
    setTimeout(function() {
      var currentTrafficType = tk1Text.toLowerCase();
      
      // Log the corresponding URL for the final request
      console.log("URL tương ứng (Request final):", secondUrlMap[currentTrafficType]);
      SecondUrl123 = secondUrlMap[currentTrafficType];

      // Log the traffic type detected and update the base URL
      console.log(`Phát hiện ${tk1Text}, thay đổi URL_Goc_Vuatraffic thành ${loaitraffic[tk1Text]}`);
      URL_Goc_Vuatraffic = loaitraffic[tk1Text];
      displayAndUpdateTable("", URL_Goc_Vuatraffic, "");
      sendFirstRequest();  // Send the first request
    }, 500);  // Wait for 1 second before performing the action
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


