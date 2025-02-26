var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
document.head.appendChild(script);

script.onload = function() {
    console.log("Axios đã được tải thành công.");
};
var URL_Goc_Vuatraffic = window.location.href;
var code_link = "";
var scriptElements = document.getElementsByTagName("script");
for (var script of scriptElements) {
    var match = script.textContent.match(/var code_link = \"(.*?)\";/);
    if (match) {
        code_link = match[1];
        break;
    }
}

// Các loại traffic và URLs
var secondUrlMap = {
    "w88": "https://188.166.185.213/admin",
    "188bet": "https://165.22.63.250/admin",
    "vn88": "https://vn88ru.com/admin",
    "m88": "https://bet88en.com/admin",
    "fb88": "https://fb88fo.com/admin",
    "bk8": "https://bk8tr.com/admin",
    "v9bet": "https://v9betpp.com/admin"
};

var loaitraffic = {
    "w88": "https://188.166.185.213",
    "188bet": "https://165.22.63.250",
    "vn88": "https://vn88ru.com",
    "m88": "https://bet88en.com",
    "fb88": "https://fb88fo.com",
    "bk8": "https://bk8tr.com",
    "v9bet": "https://v9betpp.com"
};

// Kiểm tra loại traffic từ URL
function checkTrafficType(url) {
    let trafficType = Object.keys(loaitraffic).find(key => url.includes(key));
    console.log("Loại traffic tìm thấy:", trafficType);
    return trafficType;
}

// Hàm chờ và lấy giá trị từ TK1
function waitForTK1(callback) {
    var checkExist = setInterval(function() {
        var TUKHOA1 = document.getElementById("TK1");
        if (TUKHOA1) {
            clearInterval(checkExist);
            callback(TUKHOA1.textContent.trim().toLowerCase());
        }
    }, 1000);
}

// Chờ lấy giá trị từ TK1 và xử lý
waitForTK1(function(tk1Text) {
    var currentTrafficType = tk1Text.toLowerCase();
    if (secondUrlMap[currentTrafficType]) {
        console.log("URL tương ứng (Request đầu tiên):", secondUrlMap[currentTrafficType]);
        SecondUrl123 = secondUrlMap[currentTrafficType];
    }
    if (loaitraffic[tk1Text]) {
        console.log(`Phát hiện ${tk1Text}, thay đổi URL_Goc_Vuatraffic thành ${loaitraffic[tk1Text]}`);
        URL_Goc_Vuatraffic = loaitraffic[tk1Text];  // Update URL nếu loại traffic khớp
    }
    sendFirstRequest(); // Gửi yêu cầu đầu tiên
});

// Request thứ nhất
function sendFirstRequest() { 
    const d = new Date();
    const random = d.getTime();
    const data = `data=${random},https://www.google.com/,undefined,IOS900,hidden,null&clk=null`;
    const url1 = `https://traffic-user.net/GET_VUATRAFFIC.php?${data}`;

    axios.post(url1, null, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
    })
    .then(response => {
        const responseText = response.data;
        const match = responseText.match(/localStorage.codexn\s*=\s*'([\w-]+)'/);
        if (match && match[1]) {
            const codexnValue = match[1];
            console.log("Lấy được codexn:", codexnValue);
            localStorage.setItem("codexn", codexnValue);
            sendSecondRequest(codexnValue);
        } else {
            console.error("Không tìm thấy codexn trong phản hồi.");
        }
    })
    .catch(error => {
        console.error("Lỗi request 1:", error);
    });
}

function sendFirstRequest123() { 
    const d = new Date();
    const random = d.getTime();
    const CLK = sessionStorage.getItem("ymnclk");
    const data = `data=${random},https://www.google.com/,undefined,IOS900,hidden,null&clk=${CLK}`;
    const url1 = `https://traffic-user.net/GET_VUATRAFFIC.php?${data}`;

    axios.post(url1, null, {
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })
    .then(response => {
        const responseText = response.data;
        const match = responseText.match(/localStorage.codexn\s*=\s*'([\w-]+)'/);
        if (match && match[1]) {
            const codexnValue = match[1];
            console.log("Lấy được codexn:", codexnValue);
            localStorage.setItem("codexn", codexnValue);
            sendSecondRequest123(codexnValue);
        } else {
            console.error("Không tìm thấy codexn trong phản hồi.");
        }
    })
    .catch(error => {
        console.error("Lỗi request 1:", error);
    });
}

function sendSecondRequest(codexnValue) {
    const CLK = "&clk=" + (sessionStorage.getItem("ymnclk") || "null");
    const data = `codexn=${codexnValue}&url=${URL_Goc_Vuatraffic}&loai_traffic=https://www.google.com/${CLK}`;
    const url2 = `https://traffic-user.net/GET_MA.php?${data}`;

    axios.post(url2, null, {
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })
    .then(response => {
        const responseText = response.data;
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
                setTimeout(() => localStorage.removeItem("URL_Goc_Vuatraffic"), 2000);
                sessionStorage.setItem("ymnclk", ymnclkMatch[1]);
                console.log("Lưu ymnclk:", ymnclkMatch[1]);
                sendFirstRequest123();
            } else {
                console.warn("Không tìm thấy sessionStorage.setItem trong phản hồi.");
            }
        }
    })
    .catch(error => {
        console.error("Lỗi request 2:", error);
    });
}

function sendSecondRequest123(codexnValue) {
    const CLK = "&clk=" + (sessionStorage.getItem("ymnclk") || "null");
    const data = `codexn=${codexnValue}&url=${SecondUrl123}&loai_traffic=${URL_Goc_Vuatraffic}/${CLK}`;
    const url2 = `https://traffic-user.net/GET_MA.php?${data}`;

    axios.post(url2, null, {
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })
    .then(response => {
        const responseText = response.data;
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
                setTimeout(() => localStorage.removeItem("URL_Goc_Vuatraffic"), 2000);
                sessionStorage.setItem("ymnclk", ymnclkMatch[1]);
                console.log("Lưu ymnclk:", ymnclkMatch[1]);
                sendSecondRequest123(codexnValue);
            } else {
                console.warn("Không tìm thấy sessionStorage.setItem trong phản hồi.");
            }
        }
    })
    .catch(error => {
        console.error("Lỗi request 2:", error);
    });
}

// 7️⃣ Gửi mã để kiểm tra bằng GM_xmlhttpRequest
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
        },
        onload: function(response) {
            // Lấy URL cuối cùng sau khi redirect
            const finalUrl = response.finalUrl; // Lấy URL cuối cùng sau khi chuyển hướng
            console.log("Link cuối cùng sau khi redirect: ", finalUrl);
        },
        onerror: function(error) {
            console.error("Lỗi mạng khi gửi request 3:", error);
        }
    });
}
