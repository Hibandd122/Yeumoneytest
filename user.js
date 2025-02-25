// ==UserScript==
// @name         Auto Click Yeumoney
// @match        https://yeumoney.com/*
// ==/UserScript==

(function() {
    'use strict';

    let hasClicked = {
        keyInput: false,
        fetchCode: false,
        autoStart: false,
        startButton: false,
        changeTaskButton: false
    };

    function autoBypass() {
        console.log("🔄 Đang kiểm tra trang...");

        // 1️⃣ Nhập key trước tiên
        let keyInput = document.querySelector('input[placeholder="Nhập key của bạn"]');
        if (keyInput && keyInput.value !== "HwZVdbkwZtUAxUZjzpMy" && !hasClicked.keyInput) {
            keyInput.value = "HwZVdbkwZtUAxUZjzpMy";
            keyInput.dispatchEvent(new Event('input', { bubbles: true }));
            hasClicked.keyInput = true;
            console.log("🔑 Đã nhập key.");
            return; // Chờ lần kiểm tra tiếp theo
        }

        // 2️⃣ Tự động bật checkbox nếu chưa được chọn
        ["fetchCode", "autoStart"].forEach(id => {
            let checkbox = document.getElementById(id);
            if (checkbox && !checkbox.checked && !hasClicked[id]) {
                checkbox.click();
                hasClicked[id] = true;
                console.log(`✅ Đã bật checkbox: ${id}`);
            }
        });

        // 3️⃣ Tự động bấm nút "Bắt đầu Bypass" (chỉ bấm một lần)
        if (!hasClicked.startButton) {
            let startButton = [...document.getElementsByTagName("button")].find(btn => btn.innerText.trim() === "Bắt đầu Bypass");
            if (startButton) {
                startButton.click();
                hasClicked.startButton = true;
                console.log("🚀 Đã bấm vào nút 'Bắt đầu Bypass'");
            }
        }

        // 4️⃣ Kiểm tra lỗi trong input và bấm "Đổi Nhiệm Vụ" nếu cần (chỉ bấm một lần)
        let inputField = document.querySelector('input[placeholder="Nếu để trống sẽ sử dụng URL nhận diện!"]');
        if (inputField && inputField.value.trim() === "Lỗi! Vui lòng xem lại URL." && !hasClicked.changeTaskButton) {
            console.log("❗ Phát hiện lỗi URL, tiến hành bấm nút 'Đổi Nhiệm Vụ'...");

            let changeTaskButton = [...document.getElementsByTagName("button")].find(btn => btn.innerText.trim() === "Đổi Nhiệm Vụ");
            if (changeTaskButton) {
                changeTaskButton.click();
                hasClicked.changeTaskButton = true;
                console.log("🔄 Đã bấm vào nút 'Đổi Nhiệm Vụ'");
            }
        }

        // Nếu tất cả đã bấm, dừng kiểm tra
        if (Object.values(hasClicked).every(v => v)) {
            console.log("✅ Đã hoàn thành tất cả thao tác. Dừng kiểm tra.");
            clearInterval(interval);
        }
    }

    // Kiểm tra liên tục nhưng chỉ bấm một lần mỗi phần
    let interval = setInterval(autoBypass, 1000);

})();
