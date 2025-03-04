// ==UserScript==
// @name         Yeumoney so gay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass Yeumoney
// @author       Hibandd122
// @match        https://yeumoney.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @run-at       document-end
// ==/UserScript==
let Text123 = "";
var maContainer = document.createElement("div");
maContainer.id = "maContainer";
maContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: ${localStorage.getItem("maContainerColor") || "linear-gradient(135deg, rgb(31, 176, 196), rgb(20, 164, 201))"};
    padding: 20px;
    font-family: 'Segoe UI', 'Arial', sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: #4a3467;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
    text-align: center;
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.05);
    transition: background 0.3s ease;
`;

document.body.appendChild(maContainer);

function displayAndUpdateTable(status, code, keyword, URL_Goc_Vuatraffic, finalUrl) {
    maContainer.innerHTML = '';

    const tableContainer = document.createElement("div");
    tableContainer.style.cssText = `
        width: 95%;
        max-width: 1400px;
        overflow-x: auto;
        padding: 10px;
    `;

    const rainbowWrapper = document.createElement("div");
    rainbowWrapper.style.cssText = `
        padding: 15px;
        background: #fff;
        border: 8px solid;
        border-image: linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet) 1;
        border-radius: 20px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    `;

    const table = document.createElement("table");
    table.style.cssText = `
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-family: 'Segoe UI', 'Arial', sans-serif;
        background-color: #f7fafc;
        font-size: 22px;
        text-align: center;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        border-radius: 15px;
        overflow: hidden;
    `;

    const headers = [
        { text: "Status", icon: "📊" },
        { text: "Mã", icon: "🔑" },
        { text: "Từ khoá", icon: "🔍" },
        { text: "Loại Traffic", icon: "🚦" }
    ];
    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.innerHTML = `${header.icon} ${header.text}`;
        th.style.cssText = `
            background: linear-gradient(135deg, #1e90ff, #00ced1);
            color: #ffffff;
            padding: 20px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 700;
            white-space: nowrap;
            min-width: 200px;
            border-bottom: 3px solid rgba(255, 255, 255, 0.2);
            transition: background 0.3s ease;
        `;
        th.addEventListener("mouseover", () => {
            th.style.background = "linear-gradient(135deg, #00ced1, #1e90ff)";
        });
        th.addEventListener("mouseout", () => {
            th.style.background = "linear-gradient(135deg, #1e90ff, #00ced1)";
        });
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const dataRow = document.createElement("tr");
    [status, code || "N/A", keyword || "N/A", URL_Goc_Vuatraffic || "N/A"].forEach((cellText, index) => {
        const td = document.createElement("td");
        td.textContent = cellText;
        td.style.cssText = `
            padding: 18px;
            border-bottom: 1px solid #e0e0e0;
            background-color: ${index % 2 === 0 ? "#edf2f7" : "#f7fafc"};
            font-size: 20px;
            font-weight: 500;
            min-width: 200px;
            max-width: 400px;
            word-break: break-word;
            color: #2d3748;
            transition: background-color 0.3s ease;
        `;
        td.addEventListener("mouseover", () => {
            td.style.backgroundColor = "#e2e8f0";
        });
        td.addEventListener("mouseout", () => {
            td.style.backgroundColor = index % 2 === 0 ? "#edf2f7" : "#f7fafc";
        });
        dataRow.appendChild(td);
    });
    table.appendChild(dataRow);

    const finalUrlRow = document.createElement("tr");
    const finalUrlTd = document.createElement("td");
    finalUrlTd.colSpan = 4;
    finalUrlTd.style.cssText = `
        padding: 25px;
        background: linear-gradient(135deg, #f7fafc, #e6fffa);
        color: #1a202c;
        font-size: 22px;
        font-weight: 600;
        text-align: center;
        word-break: break-word;
        border-top: 2px dashed #b2f5ea;
    `;

    const urlText = document.createElement("div");
    urlText.innerHTML = `<span style="color:rgb(0, 0, 0); font-weight: 700;">🔗 Final URL:</span> ${finalUrl || "N/A"}`;
    finalUrlTd.appendChild(urlText);

    if (finalUrl) {
        const copyButton = document.createElement("button");
        copyButton.innerHTML = "📋 Copy";
        copyButton.style.cssText = `
            margin-top: 15px;
            padding: 10px 25px;
            background-color: rgb(0, 255, 34);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
        `;
        copyButton.addEventListener("mouseover", () => {
            copyButton.style.backgroundColor = "#4CAF50";
            copyButton.style.transform = "translateY(-2px)";
        });
        copyButton.addEventListener("mouseout", () => {
            copyButton.style.backgroundColor = "#00FF22";
            copyButton.style.transform = "translateY(0)";
        });
        copyButton.addEventListener("click", () => {
            navigator.clipboard.writeText(finalUrl)
                .then(() => {
                    copyButton.innerHTML = "✅ Copied!";
                    copyButton.style.backgroundColor = "#00FF22";
                    setTimeout(() => {
                        copyButton.innerHTML = "📋 Copy";
                        copyButton.style.backgroundColor = "#00FF22";
                    }, 2000);
                })
                .catch(err => {
                    console.error("Failed to copy: ", err);
                });
        });
        finalUrlTd.appendChild(copyButton);
    }

    finalUrlRow.appendChild(finalUrlTd);
    table.appendChild(finalUrlRow);
    rainbowWrapper.appendChild(table);
    tableContainer.appendChild(rainbowWrapper);
    maContainer.appendChild(tableContainer);

    const style = document.createElement("style");
    style.textContent = `
        :root {
            --min-width: 200px;
            --max-width-th: 300px;
            --max-width-td: 400px;
            --font-size-th: 22px;
            --font-size-td: 20px;
            --padding-th: 20px;
            --padding-td: 18px;
        }
        th {
            min-width: var(--min-width);
            max-width: var(--max-width-th);
            font-size: var(--font-size-th);
            padding: var(--padding-th);
            overflow: hidden;
            text-overflow: ellipsis;
        }
        td {
            min-width: var(--min-width);
            max-width: var(--max-width-td);
            font-size: var(--font-size-td);
            padding: var(--padding-td);
            overflow: hidden;
            text-overflow: ellipsis;
        }
        table {
            font-size: var(--font-size-th);
        }
        @media (max-width: 1024px) {
            :root {
                --min-width: 150px;
                --max-width-th: 250px;
                --max-width-td: 350px;
                --font-size-th: 20px;
                --font-size-td: 18px;
                --padding-th: 15px;
                --padding-td: 14px;
            }
        }
        @media (max-width: 768px) {
            :root {
                --min-width: 120px;
                --max-width-th: 200px;
                --max-width-td: 300px;
                --font-size-th: 18px;
                --font-size-td: 16px;
                --padding-th: 12px;
                --padding-td: 10px;
            }
        }
        @media (max-width: 640px) {
            :root {
                --min-width: 100px;
                --max-width-th: 180px;
                --max-width-td: 250px;
                --font-size-th: 16px;
                --font-size-td: 14px;
                --padding-th: 10px;
                --padding-td: 8px;
            }
        }
        @media (max-width: 480px) {
            :root {
                --min-width: 80px;
                --max-width-th: 150px;
                --max-width-td: 200px;
                --font-size-th: 14px;
                --font-size-td: 12px;
                --padding-th: 8px;
                --padding-td: 6px;
            }
        }
        @media (max-width: 360px) {
            :root {
                --min-width: 60px;
                --max-width-th: 120px;
                --max-width-td: 150px;
                --font-size-th: 12px;
                --font-size-td: 10px;
                --padding-th: 6px;
                --padding-td: 5px;
            }
        }
        @media (max-width: 280px) {
            :root {
                --min-width: 50px;
                --max-width-th: 100px;
                --max-width-td: 120px;
                --font-size-th: 10px;
                --font-size-td: 9px;
                --padding-th: 4px;
                --padding-td: 3px;
            }
        }
        @media (max-width: 100px) {
            :root {
                --min-width: 25px;
                --max-width-th: 50px;
                --max-width-td: 50px;
                --font-size-th: 8px;
                --font-size-td: 7px;
                --padding-th: 2px;
                --padding-td: 2px;
            }
        }
    `;
    document.head.appendChild(style);

    // Container for controls (checkbox and button)
    const controlsContainer = document.createElement("div");
    controlsContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 20px;
        margin-top: 25px;
    `;

    const label = document.createElement("label");
    label.style.cssText = `
        font-size: 20px;
        color: #2d3748;
        font-weight: 500;
    `;
    label.innerHTML = "🔄 Tự động chuyển hướng: ";

    if (localStorage.getItem("autoRedirect") === null) {
        localStorage.setItem("autoRedirect", "true");
    }

    const autoRedirectCheckbox = document.createElement("input");
    autoRedirectCheckbox.type = "checkbox";
    autoRedirectCheckbox.checked = localStorage.getItem("autoRedirect") === "true";
    autoRedirectCheckbox.style.cssText = `
        margin-left: 10px;
        transform: scale(1.5);
        cursor: pointer;
    `;
    autoRedirectCheckbox.addEventListener("change", () => {
        localStorage.setItem("autoRedirect", autoRedirectCheckbox.checked);
    });

    label.appendChild(autoRedirectCheckbox);

    const changeTaskButton = document.createElement("button");
    changeTaskButton.innerHTML = "🔄 Đổi nhiệm vụ";
    changeTaskButton.style.cssText = `
        padding: 10px 25px;
        background-color: #e53e3e;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 18px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
    `;
    changeTaskButton.addEventListener("mouseover", () => {
        changeTaskButton.style.backgroundColor = "#c53030";
        changeTaskButton.style.transform = "translateY(-2px)";
    });
    changeTaskButton.addEventListener("mouseout", () => {
        changeTaskButton.style.backgroundColor = "#e53e3e";
        changeTaskButton.style.transform = "translateY(0)";
    });
    changeTaskButton.addEventListener("click", () => {
        location.reload(true);
    });

    controlsContainer.appendChild(label);
    controlsContainer.appendChild(changeTaskButton);
    maContainer.appendChild(controlsContainer);

    setInterval(() => {
        if (localStorage.getItem("autoRedirect") === "true" && finalUrl && status === "Hoàn thành") {
            window.location.href = finalUrl;
        }
    }, 500);

    // Cập nhật màu cho displayAndUpdateTable dựa trên màu maContainer
    updateTableColors(localStorage.getItem("maContainerColor") || "linear-gradient(135deg, rgb(31, 176, 196), rgb(20, 164, 201))");
}

// Hàm cập nhật màu cho bảng displayAndUpdateTable
function updateTableColors(selectedColor) {
    const table = document.querySelector("table");
    const thElements = document.querySelectorAll("th");
    const tdElements = document.querySelectorAll("td");
    const finalUrlTd = document.querySelector("td[colspan='4']");
    const changeTaskButton = document.querySelector("button[style*='background-color: #e53e3e']");

    // Mảng ánh xạ màu cho các thành phần
    const colorMap = {
        "linear-gradient(135deg, rgb(31, 176, 196), rgb(20, 164, 201))": { th: "#1e90ff", tdEven: "#edf2f7", tdOdd: "#f7fafc", finalTd: "#e6fffa", button: "#00ff22" },
        "linear-gradient(135deg, #4CAF50, #81C784)": { th: "#388E3C", tdEven: "#E8F5E9", tdOdd: "#F1F8E9", finalTd: "#C8E6C9", button: "#4CAF50" },
        "linear-gradient(135deg, #F44336, #E57373)": { th: "#D32F2F", tdEven: "#FFEBEE", tdOdd: "#FFCDD2", finalTd: "#EF9A9A", button: "#F44336" },
        "linear-gradient(135deg, #FFEB3B, #FFF176)": { th: "#FBC02D", tdEven: "#FFF9C4", tdOdd: "#FFFDE7", finalTd: "#FFF59D", button: "#FFEB3B" },
        "linear-gradient(135deg, #9C27B0, #CE93D8)": { th: "#7B1FA2", tdEven: "#F3E5F5", tdOdd: "#E1BEE7", finalTd: "#CE93D8", button: "#9C27B0" },
        "linear-gradient(135deg, #FF5722, #FFAB91)": { th: "#E64A19", tdEven: "#FFCCBC", tdOdd: "#FFEBEE", finalTd: "#FFAB91", button: "#FF5722" },
        "linear-gradient(135deg, #2196F3, #64B5F6)": { th: "#1976D2", tdEven: "#BBDEFB", tdOdd: "#E3F2FD", finalTd: "#90CAF9", button: "#2196F3" },
        "linear-gradient(135deg, #E91E63, #F06292)": { th: "#C2185B", tdEven: "#FCE4EC", tdOdd: "#F8BBD0", finalTd: "#F48FB1", button: "#E91E63" },
        "linear-gradient(135deg, #607D8B, #B0BEC5)": { th: "#455A64", tdEven: "#CFD8DC", tdOdd: "#ECEFF1", finalTd: "#B0BEC5", button: "#607D8B" },
        "linear-gradient(135deg, #795548, #A1887F)": { th: "#5D4037", tdEven: "#D7CCC8", tdOdd: "#EFEBE9", finalTd: "#BCAAA4", button: "#795548" },
        "linear-gradient(135deg, #00BCD4, #4DD0E1)": { th: "#0097A7", tdEven: "#B2EBF2", tdOdd: "#E0F7FA", finalTd: "#80DEEA", button: "#00BCD4" },
        "linear-gradient(135deg, #673AB7, #9575CD)": { th: "#512DA8", tdEven: "#EDE7F6", tdOdd: "#D1C4E9", finalTd: "#B39DDB", button: "#673AB7" }
    };

    const colors = colorMap[selectedColor] || colorMap["linear-gradient(135deg, rgb(31, 176, 196), rgb(20, 164, 201))"];
    if (table) {
        table.style.backgroundColor = colors.tdOdd;
    }
    thElements.forEach(th => {
        th.style.background = `linear-gradient(135deg, ${colors.th}, ${colors.button})`;
        th.addEventListener("mouseout", () => th.style.background = `linear-gradient(135deg, ${colors.th}, ${colors.button})`);
        th.addEventListener("mouseover", () => th.style.background = `linear-gradient(135deg, ${colors.button}, ${colors.th})`);
    });
    tdElements.forEach((td, index) => {
        if (td.colSpan !== 4) {
            td.style.backgroundColor = index % 2 === 0 ? colors.tdEven : colors.tdOdd;
            td.addEventListener("mouseout", () => td.style.backgroundColor = index % 2 === 0 ? colors.tdEven : colors.tdOdd);
        }
    });
    if (finalUrlTd) {
        finalUrlTd.style.background = `linear-gradient(135deg, ${colors.tdOdd}, ${colors.finalTd})`;
    }
    if (changeTaskButton) {
        changeTaskButton.style.backgroundColor = colors.button;
        changeTaskButton.addEventListener("mouseout", () => changeTaskButton.style.backgroundColor = colors.button);
    }
}

// Nút đổi màu và bảng chọn màu
const colorButton = document.createElement("button");
colorButton.innerHTML = "🎨 Đổi màu";
colorButton.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    padding: 8px 15px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    z-index: 10000;
    transition: all 0.3s ease;
`;
colorButton.addEventListener("mouseover", () => {
    colorButton.style.backgroundColor = "#357abd";
    colorButton.style.transform = "translateY(-2px)";
});
colorButton.addEventListener("mouseout", () => {
    colorButton.style.backgroundColor = "#4a90e2";
    colorButton.style.transform = "translateY(0)";
});
document.body.appendChild(colorButton);

// Tạo bảng chọn màu (to và ở giữa)
const colorPanel = document.createElement("div");
colorPanel.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 10001;
    display: none;
    width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
`;
document.body.appendChild(colorPanel);

// Danh sách màu preset
const colorOptions = [
    { name: "Mặc định", value: "linear-gradient(135deg, rgb(31, 176, 196), rgb(20, 164, 201))" },
    { name: "Xanh lá", value: "linear-gradient(135deg, #4CAF50, #81C784)" },
    { name: "Đỏ", value: "linear-gradient(135deg, #F44336, #E57373)" },
    { name: "Vàng", value: "linear-gradient(135deg, #FFEB3B, #FFF176)" },
    { name: "Tím", value: "linear-gradient(135deg, #9C27B0, #CE93D8)" },
    { name: "Cam", value: "linear-gradient(135deg, #FF5722, #FFAB91)" },
    { name: "Xanh dương", value: "linear-gradient(135deg, #2196F3, #64B5F6)" },
    { name: "Hồng", value: "linear-gradient(135deg, #E91E63, #F06292)" },
    { name: "Xám", value: "linear-gradient(135deg, #607D8B, #B0BEC5)" },
    { name: "Nâu", value: "linear-gradient(135deg, #795548, #A1887F)" },
    { name: "Xanh ngọc", value: "linear-gradient(135deg, #00BCD4, #4DD0E1)" },
    { name: "Tím đậm", value: "linear-gradient(135deg, #673AB7, #9575CD)" }
];

// Tạo các nút màu
colorOptions.forEach(option => {
    const colorBtn = document.createElement("button");
    colorBtn.innerHTML = option.name;
    colorBtn.style.cssText = `
        padding: 10px 20px;
        background: ${option.value};
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        text-align: center;
        width: 120px;
        transition: transform 0.3s ease;
    `;
    colorBtn.addEventListener("mouseover", () => {
        colorBtn.style.transform = "translateY(-2px)";
    });
    colorBtn.addEventListener("mouseout", () => {
        colorBtn.style.transform = "translateY(0)";
    });
    colorBtn.addEventListener("click", () => {
        localStorage.setItem("maContainerColor", option.value);
        maContainer.style.background = option.value;
        updateTableColors(option.value); // Cập nhật màu cho bảng
    });
    colorPanel.appendChild(colorBtn);
});

// Chuyển đổi hiển thị bảng chọn màu khi bấm nút "Đổi màu"
let isColorPanelVisible = false;
colorButton.addEventListener("click", () => {
    isColorPanelVisible = !isColorPanelVisible; // Chuyển đổi trạng thái
    colorPanel.style.display = isColorPanelVisible ? "flex" : "none"; // Hiển thị hoặc ẩn
    colorButton.innerHTML = isColorPanelVisible ? "🎨 Đổi màu" : "🎨 Đổi màu"; // Thay đổi chữ trên nút
});

var URL_Goc_Vuatraffic = "";
var code_link = "";
var finalUrl = "";

var scriptElements = document.getElementsByTagName("script");
for (var script of scriptElements) {
    var match = script.textContent.match(/var code_link = \"(.*?)\";/);
    if (match) {
        code_link = match[1];
        break;
    }
}

function findKeywork() {
    displayAndUpdateTable("Đang tìm nhiệm vụ", "", "", "", "");
    function checkTK1() {
        const tk1Element = document.getElementById("TK1");
        if (tk1Element) {
            const tk1Text = tk1Element.textContent.trim();
            if (tk1Text) {
                Text123 = tk1Text;
                handleTrafficType(tk1Text);
                return;
            }
        }
        setTimeout(checkTK1);
    }
    checkTK1();
}

var urlMap = {
    "w88": "https://188.166.185.213",
    "188bet": "https://165.22.63.250",
    "vn88": "https://vn88mo.com",
    "m88": "https://bet88li.com",
    "fb88": "https://fb88dv.com",
    "bk8": "https://188.166.189.40",
    "v9bet": "https://188.166.224.89"
};

function handleTrafficType(tk1Text) {
    setTimeout(function() {
        var currentTrafficType = tk1Text.toLowerCase();
        URL_Goc_Vuatraffic = urlMap[currentTrafficType] || "";
        displayAndUpdateTable("Đang get mã", "", Text123, URL_Goc_Vuatraffic, "");
        if (URL_Goc_Vuatraffic) {
            startBypass(URL_Goc_Vuatraffic);
        } else {
            displayAndUpdateTable("Lỗi", "", Text123, "", "Không tìm thấy URL");
            sendErrorToDiscord("Invalid Traffic Type", `No URL for ${currentTrafficType}`);
            location.reload(true);
        }
    });
}

function sendFirstRequest(ymnclk) {
    return new Promise((resolve, reject) => {
        const random = Date.now();
        const data = `data=${random},https://www.google.com/,undefined,IOS900,hidden,null&clk=${ymnclk || ''}`;
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
                        displayAndUpdateTable("Lỗi codexn", "", Text123, URL_Goc_Vuatraffic, finalUrl);
                        sendErrorToDiscord("No codexn", responseText);
                        reject(new Error("No codexn found"));
                    }
                } else {
                    displayAndUpdateTable("Lỗi HTTP", "", Text123, URL_Goc_Vuatraffic, finalUrl);
                    sendErrorToDiscord("HTTP Error", xhr.statusText);
                    reject(new Error(xhr.statusText));
                    location.reload(true);
                }
            }
        };
        xhr.send(null);
    });
}

function sendSecondRequest(URL_Goc_Vuatraffic, codexnValue, ymnclk) {
    return new Promise((resolve, reject) => {
        const data = `codexn=${codexnValue}&url=${URL_Goc_Vuatraffic}&loai_traffic=https://www.google.com/&clk=${ymnclk || ''}`;
        const url2 = `https://traffic-user.net/GET_MA.php?${data}`;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", url2, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const responseText = xhr.responseText;
                    if (/<script>\s*sessionStorage\.removeItem\("ymnclk"\);\s*<\/script>/gi.test(responseText)) {
                        sessionStorage.removeItem("ymnclk");
                        const spanMatch = responseText.match(/<span id="layma_me_vuatraffic"[^>]*>\s*(\d+)\s*<\/span>/);
                        if (spanMatch && spanMatch[1]) {
                            resolve(spanMatch[1]);
                        } else {
                            resolve(null); // If no spanMatch, proceed without code
                        }
                    } else {
                        const ymnclkMatch = responseText.match(/sessionStorage.setItem\("ymnclk",\s*(\d+)\)/);
                        if (ymnclkMatch && ymnclkMatch[1]) {
                            resolve(ymnclkMatch[1]);
                        } else {
                            displayAndUpdateTable("Lỗi ymnclk", "", Text123, URL_Goc_Vuatraffic, finalUrl);
                            sendErrorToDiscord("No ymnclk", responseText);
                            reject(new Error("No ymnclk found"));
                        }
                    }
                } else {
                    displayAndUpdateTable("Lỗi HTTP", "", Text123, URL_Goc_Vuatraffic, finalUrl);
                    sendErrorToDiscord("HTTP Error", xhr.statusText);
                    reject(new Error(xhr.statusText));
                    location.reload(true);
                }
            }
        };
        xhr.send(null);
    });
}

function sendCodeToCheck(code) {
    return new Promise((resolve, reject) => {
        const url3 = `https://yeumoney.com/quangly/check_code.php?token=${code_link}`;
        const id_traffic = document.querySelector("#id_donhang")?.value || "";
        const check_index = document.querySelector("#check_index")?.value || "";
        const check_gt = document.querySelector("#check_gt")?.value || "";

        const params = new URLSearchParams({
            code: code,
            keyword: Text123,
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
        displayAndUpdateTable("Sắp hoàn thành", code, Text123, URL_Goc_Vuatraffic, "");
        GM_xmlhttpRequest({
            method: "POST",
            url: url3,
            data: params.toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://yeumoney.com/"
            },
            onload: function(response) {
                finalUrl = response.finalUrl || "";
                if (finalUrl.includes("#xuong")) {
                    displayAndUpdateTable("Lỗi check code", code, Text123, URL_Goc_Vuatraffic, finalUrl);
                    sendErrorToDiscord("Check Code Error", "");
                    location.reload(true);
                    reject(new Error("Invalid final URL"));
                } else {
                    resolve(finalUrl);
                }
            },
            onerror: function(error) {
                displayAndUpdateTable("Lỗi check code", code, Text123, URL_Goc_Vuatraffic, finalUrl);
                sendErrorToDiscord("Check Code Error", error.toString());
                location.reload(true);
                reject(error);
            }
        });
    });
}

function sendErrorToDiscord(errorType, details) {
    const hinhElement = document.getElementById("hinh_nv");
    const hinhSrc = hinhElement ? hinhElement.src : "Không có ảnh";
    fetch("https://discord.com/api/webhooks/1344884575901581332/-4hrDVpyDMFAav2sgRutN2Dmws9gqzTFrpHKWXzuqBKrdKC9Smxr5fOOOdjOmrKSNl8q", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: `Lỗi xảy ra! @toilahola \nLoại lỗi: ${errorType}\nTừ khóa: ${Text123 || "N/A"}\nẢnh: ${hinhSrc}\nChi tiết: ${details.substring(0, 500)}`
        })
    })
    .catch(err => console.error("Gửi Discord thất bại:", err));
}

async function startBypass(URL_Goc_Vuatraffic) {
    let code = "";
    try {
        const codexnValue1 = await sendFirstRequest(null);
        const ymnclk1 = await sendSecondRequest(URL_Goc_Vuatraffic, codexnValue1, null);
        const codexnValue2 = await sendFirstRequest(ymnclk1);
        const url = URL_Goc_Vuatraffic + "/admin";
        code = await sendSecondRequest(url, codexnValue2, ymnclk1);
        if (code) {
            finalUrl = await sendCodeToCheck(code);
            displayAndUpdateTable("Hoàn thành", code, Text123, URL_Goc_Vuatraffic, finalUrl);
        } else {
            throw new Error("No code received from second request");
        }

        // Continuous check for autoRedirect in startBypass
        setInterval(() => {
            if (localStorage.getItem("autoRedirect") === "true" && finalUrl) {
                window.location.href = finalUrl;
            }
        }, 1000); // Check every 500ms
    } catch (error) {
        displayAndUpdateTable("Lỗi", code, Text123, URL_Goc_Vuatraffic, finalUrl || "Không lấy được URL");
        sendErrorToDiscord("Bypass Error", error.message || "Unknown error");
        location.reload(true);
    }
}

findKeywork();

