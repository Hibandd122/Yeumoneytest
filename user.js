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

(async () => {
    'use strict';

    const DEFAULT_COLOR = "linear-gradient(135deg, rgb(31, 176, 196), rgb(20, 164, 201))";
    const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1344884575901581332/-4hrDVpyDMFAav2sgRutN2Dmws9gqzTFrpHKWXzuqBKrdKC9Smxr5fOOOdjOmrKSNl8q";
    const URL_MAP = Object.freeze({
        w88: "https://188.166.185.213",
        "188bet": "https://165.22.63.250",
        vn88: "https://vn88mo.com",
        m88: "https://bet88li.com",
        fb88: "https://fb88dv.com",
        bk8: "https://188.166.189.40",
        v9bet: "https://188.166.224.89"
    });

    let keyword = "";
    let trafficUrl = "";
    let codeLink = "";
    let finalUrl = "";

    // Initialize container
    const container = document.body.appendChild(Object.assign(document.createElement("div"), {
        id: "maContainer",
        style: `
            position: fixed;
            inset: 0;
            background: ${GM_getValue("maContainerColor", DEFAULT_COLOR)};
            padding: 20px;
            font: 600 28px 'Segoe UI', Arial, sans-serif;
            color: #4a3467;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow-y: auto;
            text-align: center;
            box-shadow: inset 0 0 15px rgba(0,0,0,0.05);
            transition: background 0.3s ease;
        `
    }));

    // Persistent controls container
    const controls = document.body.appendChild(Object.assign(document.createElement("div"), {
        style: `
            position: fixed;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
            z-index: 10000;
        `
    }));

    // Auto Redirect Button
    const autoRedirectBtn = controls.appendChild(Object.assign(document.createElement("button"), {
        innerHTML: `🔄 Tự động chuyển hướng: ${GM_getValue("autoRedirect", true) ? "Bật" : "Tắt"}`,
        style: `
            padding: 10px 25px;
            background: ${GM_getValue("autoRedirect", true) ? "#4CAF50" : "#e53e3e"};
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font: 600 18px 'Segoe UI';
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `,
        onmouseover: e => Object.assign(e.target.style, {
            backgroundColor: GM_getValue("autoRedirect", true) ? "#388E3C" : "#c53030",
            transform: "translateY(-2px)"
        }),
        onmouseout: e => Object.assign(e.target.style, {
            backgroundColor: GM_getValue("autoRedirect", true) ? "#4CAF50" : "#e53e3e",
            transform: "translateY(0)"
        }),
        onclick: () => {
            const newState = !GM_getValue("autoRedirect", true);
            GM_setValue("autoRedirect", newState);
            autoRedirectBtn.innerHTML = `🔄 Tự động chuyển hướng: ${newState ? "Bật" : "Tắt"}`;
            autoRedirectBtn.style.backgroundColor = newState ? "#4CAF50" : "#e53e3e";
        }
    }));

    // Change Task Button
    controls.appendChild(Object.assign(document.createElement("button"), {
        innerHTML: "🔄 Đổi nhiệm vụ",
        style: `
            padding: 10px 25px;
            background: #e53e3e;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font: 600 18px 'Segoe UI';
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(229,62,62,0.3);
        `,
        onmouseover: e => Object.assign(e.target.style, { backgroundColor: "#c53030", transform: "translateY(-2px)" }),
        onmouseout: e => Object.assign(e.target.style, { backgroundColor: "#e53e3e", transform: "translateY(0)" }),
        onclick: () => location.reload(true)
    }));

    // Table creation
    const createTable = (status, code = "N/A", keyword = "N/A", traffic = "N/A", url = "N/A") => {
        container.innerHTML = '';
        const tableStyles = `
            table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                background: #f7fafc;
                font: 22px 'Segoe UI', Arial, sans-serif;
                text-align: center;
                box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                border-radius: 15px;
                overflow: hidden;
            }
            th {
                background: linear-gradient(135deg, #1e90ff, #00ced1);
                color: #fff;
                padding: 20px;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                font-weight: 700;
                min-width: 200px;
                border-bottom: 3px solid rgba(255,255,255,0.2);
                transition: background 0.3s;
            }
            th:hover { background: linear-gradient(135deg, #00ced1, #1e90ff); }
            td {
                padding: 18px;
                border-bottom: 1px solid #e0e0e0;
                font-weight: 500;
                min-width: 200px;
                max-width: 400px;
                word-break: break-word;
                color: #2d3748;
                transition: background 0.3s;
            }
            td:nth-child(even) { background: #edf2f7; }
            td:nth-child(odd) { background: #f7fafc; }
            td:hover { background: #e2e8f0; }
            .final-url {
                padding: 25px;
                background: linear-gradient(135deg, #f7fafc, #e6fffa);
                color: #1a202c;
                font-weight: 600;
                border-top: 2px dashed #b2f5ea;
            }
            @media (max-width: 768px) {
                th, td { min-width: 120px; font-size: 18px; padding: 12px; }
            }
        `;

        const table = container.appendChild(Object.assign(document.createElement("div"), {
            style: "width: 95%; max-width: 1400px; overflow-x: auto; padding: 10px;"
        })).appendChild(Object.assign(document.createElement("div"), {
            style: `
                padding: 15px;
                background: #fff;
                border: 8px solid;
                border-image: linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet) 1;
                border-radius: 20px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            `
        })).appendChild(Object.assign(document.createElement("table"), {
            innerHTML: `
                <tr>
                    <th>📊 Status</th>
                    <th>🔑 Mã</th>
                    <th>🔍 Từ khoá</th>
                    <th>🚦 Loại Traffic</th>
                </tr>
                <tr>
                    <td>${status}</td>
                    <td>${code}</td>
                    <td>${keyword}</td>
                    <td>${traffic}</td>
                </tr>
                <tr>
                    <td colspan="4" class="final-url">
                        <div><span style="color:#000;font-weight:700;">🔗 Final URL:</span> ${url}</div>
                        ${url !== "N/A" ? '<button style="margin-top:15px;padding:10px 25px;background:#00ff22;color:#fff;border:none;border-radius:8px;cursor:pointer;font:600 18px Segoe UI;transition:all 0.3s;box-shadow:0 4px 15px rgba(229,62,62,0.3);">📋 Copy</button>' : ''}
                    </td>
                </tr>
            `
        }));

        document.head.appendChild(Object.assign(document.createElement("style"), { textContent: tableStyles }));

        if (url !== "N/A") {
            const copyBtn = table.querySelector("button");
            copyBtn.onmouseover = () => Object.assign(copyBtn.style, { backgroundColor: "#4CAF50", transform: "translateY(-2px)" });
            copyBtn.onmouseout = () => Object.assign(copyBtn.style, { backgroundColor: "#00FF22", transform: "translateY(0)" });
            copyBtn.onclick = async () => {
                await navigator.clipboard.writeText(url);
                copyBtn.innerHTML = "✅ Copied!";
                setTimeout(() => copyBtn.innerHTML = "📋 Copy", 2000);
            };
        }

        updateTableColors(GM_getValue("maContainerColor", DEFAULT_COLOR));
        setInterval(() => GM_getValue("autoRedirect", true) && finalUrl && status === "Hoàn thành" && (window.location.href = finalUrl), 500);
    };

    // updateTableColors function (unchanged)
    const updateTableColors = selectedColor => {
        const colorMap = {
            [DEFAULT_COLOR]: { th: "#1e90ff", tdEven: "#edf2f7", tdOdd: "#f7fafc", finalTd: "#e6fffa", button: "#00ff22" },
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
        const colors = colorMap[selectedColor] || colorMap[DEFAULT_COLOR];
        const table = document.querySelector("table");
        if (table) {
            table.style.backgroundColor = colors.tdOdd;
            document.querySelectorAll("th").forEach(th => th.style.background = `linear-gradient(135deg, ${colors.th}, ${colors.button})`);
            document.querySelectorAll("td:not([colspan])").forEach((td, i) => td.style.backgroundColor = i % 2 ? colors.tdOdd : colors.tdEven);
            const finalTd = document.querySelector(".final-url");
            if (finalTd) finalTd.style.background = `linear-gradient(135deg, ${colors.tdOdd}, ${colors.finalTd})`;
            const btn = document.querySelector("button[style*='background']");
            if (btn) btn.style.backgroundColor = colors.button;
        }
    };

    // Color picker
    const colorOptions = [
        { name: "Mặc định", value: DEFAULT_COLOR },
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

    const colorBtn = document.body.appendChild(Object.assign(document.createElement("button"), {
        innerHTML: "🎨 Đổi màu",
        style: `
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 8px 15px;
            background: #4a90e2;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 10000;
            transition: all 0.3s;
        `,
        onmouseover: e => Object.assign(e.target.style, { backgroundColor: "#357abd", transform: "translateY(-2px)" }),
        onmouseout: e => Object.assign(e.target.style, { backgroundColor: "#4a90e2", transform: "translateY(0)" })
    }));

    const colorPanel = document.body.appendChild(Object.assign(document.createElement("div"), {
        style: `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            display: none;
            width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
        `
    }));

    colorOptions.forEach(({ name, value }) => {
        colorPanel.appendChild(Object.assign(document.createElement("button"), {
            innerHTML: name,
            style: `
                padding: 10px 20px;
                background: ${value};
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                width: 120px;
                transition: transform 0.3s;
            `,
            onmouseover: e => e.target.style.transform = "translateY(-2px)",
            onmouseout: e => e.target.style.transform = "translateY(0)",
            onclick: () => {
                GM_setValue("maContainerColor", value);
                container.style.background = value;
                updateTableColors(value);
            }
        }));
    });

    colorBtn.onclick = () => colorPanel.style.display = (colorPanel.style.display === "none" ? "flex" : "none");

    // Core logic (unchanged)
    codeLink = Array.from(document.getElementsByTagName("script")).find(s => s.textContent.includes("var code_link")).textContent.match(/var code_link = \"(.*?)\";/)?.[1] || "";

    const findKeyword = () => {
        createTable("Đang tìm nhiệm vụ");
        const check = () => {
            const tk1 = document.getElementById("TK1")?.textContent.trim();
            if (tk1) {
                keyword = tk1;
                handleTrafficType(tk1.toLowerCase());
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    };

    const handleTrafficType = type => {
        trafficUrl = URL_MAP[type] || "";
        createTable("Đang get mã", "", keyword, trafficUrl);
        trafficUrl ? startBypass(trafficUrl) : (createTable("Lỗi", "", keyword, "", "Không tìm thấy URL"), sendError("Invalid Traffic Type", `No URL for ${type}`), location.reload(true));
    };

    const sendRequest = (url, data) => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                xhr.status === 200 ? resolve(xhr.responseText) : (createTable("Lỗi HTTP", "", keyword, trafficUrl, finalUrl), sendError("HTTP Error", xhr.statusText), reject(new Error(xhr.statusText)), location.reload(true));
            }
        };
        xhr.send(data);
    });

    const sendFirstRequest = ymnclk => sendRequest(`https://traffic-user.net/GET_VUATRAFFIC.php?data=${Date.now()},https://www.google.com/,undefined,IOS900,hidden,null&clk=${ymnclk || ''}`, null)
        .then(resp => resp.match(/localStorage.codexn\s*=\s*'([\w-]+)'/)?.[1] || (createTable("Lỗi codexn", "", keyword, trafficUrl, finalUrl), sendError("No codexn", resp), Promise.reject(new Error("No codexn found"))));

    const sendSecondRequest = (url, codexn, ymnclk) => sendRequest(`https://traffic-user.net/GET_MA.php?codexn=${codexn}&url=${url}&loai_traffic=https://www.google.com/&clk=${ymnclk || ''}`, null)
        .then(resp => {
            if (/<script>\s*sessionStorage\.removeItem\("ymnclk"\);\s*<\/script>/gi.test(resp)) {
                sessionStorage.removeItem("ymnclk");
                return resp.match(/<span id="layma_me_vuatraffic"[^>]*>\s*(\d+)\s*<\/span>/)?.[1] || null;
            }
            const match = resp.match(/sessionStorage.setItem\("ymnclk",\s*(\d+)\)/)?.[1];
            if (match) return match;
            createTable("Lỗi ymnclk", "", keyword, trafficUrl, finalUrl);
            sendError("No ymnclk", resp);
            throw new Error("No ymnclk found");
        });

    const sendCodeToCheck = code => new Promise((resolve, reject) => {
        createTable("Sắp hoàn thành", code, keyword, trafficUrl);
        GM_xmlhttpRequest({
            method: "POST",
            url: `https://yeumoney.com/quangly/check_code.php?token=${codeLink}`,
            data: new URLSearchParams({
                code,
                keyword,
                dieuhanh: "Win32",
                pix: "1920x1080",
                lvp: "100",
                CHAN_ADS: "Block",
                ref: "$ref",
                trinhduyet: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36|1920 x 1080|Win32",
                id_traffic: document.querySelector("#id_donhang")?.value || "",
                check_index: document.querySelector("#check_index")?.value || "",
                check_gt: document.querySelector("#check_gt")?.value || ""
            }).toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://yeumoney.com/" },
            onload: resp => {
                finalUrl = resp.finalUrl || "";
                finalUrl.includes("#xuong") ? (createTable("Lỗi check code", code, keyword, trafficUrl, finalUrl), sendError("Check Code Error", ""), reject(new Error("Invalid final URL")), location.reload(true)) : resolve(finalUrl);
            },
            onerror: err => (createTable("Lỗi check code", code, keyword, trafficUrl, finalUrl), sendError("Check Code Error", err.toString()), reject(err), location.reload(true))
        });
    });

    const sendError = (type, details) => fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: `Lỗi xảy ra! @toilahola \nLoại lỗi: ${type}\nTừ khóa: ${keyword || "N/A"}\nẢnh: ${document.getElementById("hinh_nv")?.src || "Không có ảnh"}\nChi tiết: ${details.substring(0, 500)}`
        })
    }).catch(err => console.error("Discord error:", err));

    const startBypass = async url => {
        try {
            const codexn1 = await sendFirstRequest(null);
            const ymnclk1 = await sendSecondRequest(url, codexn1, null);
            const codexn2 = await sendFirstRequest(ymnclk1);
            const code = await sendSecondRequest(`${url}/admin`, codexn2, ymnclk1);
            if (code) {
                finalUrl = await sendCodeToCheck(code);
                createTable("Hoàn thành", code, keyword, url, finalUrl);
            } else throw new Error("No code received");
        } catch (err) {
            createTable("Lỗi", "", keyword, url, finalUrl || "Không lấy được URL");
            sendError("Bypass Error", err.message || "Unknown error");
            location.reload(true);
        }
    };

    findKeyword();
})();
