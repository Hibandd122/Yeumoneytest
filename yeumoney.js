let Text123 = "";
var maContainer = document.createElement("div");
maContainer.id = "maContainer";
maContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, rgb(31, 176, 196), rgb(20, 164, 201));
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
            background-color:rgb(0, 255, 34);
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
            copyButton.style.backgroundColor = "#00FF22";
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
                    copyButton.style.backgroundColor = "#00FF22"; /* Green when copied */
                    setTimeout(() => {
                        copyButton.innerHTML = "📋 Copy";
                        copyButton.style.backgroundColor = "#00FF22"; /* Back to blue */
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
        gap: 20px; /* Space between checkbox and button */
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

    // New "Đổi nhiệm vụ" button
    const changeTaskButton = document.createElement("button");
    changeTaskButton.innerHTML = "🔄 Đổi nhiệm vụ";
    changeTaskButton.style.cssText = `
        padding: 10px 25px;
        background-color: #e53e3e; /* Default red */
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
        changeTaskButton.style.backgroundColor = "#c53030"; /* Darker red on hover */
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
}

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
    "vn88": "https://139.59.238.116",
    "m88": "https://bet88se.com",
    "fb88": "https://fb88ik.com",
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
        }, 500); // Check every 500ms
    } catch (error) {
        displayAndUpdateTable("Lỗi", code, Text123, URL_Goc_Vuatraffic, finalUrl || "Không lấy được URL");
        sendErrorToDiscord("Bypass Error", error.message || "Unknown error");
        location.reload(true);
    }
}

findKeywork();

