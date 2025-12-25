// --- Bluetooth接続の模擬機能 ---
const connectBtn = document.getElementById("btn-connect");
const statusDisplay = document.getElementById("status");
let isConnected = false; // 現在の接続状態を管理

connectBtn.addEventListener("click", () => {
    isConnected = !isConnected; // 状態を反転

    if (isConnected) {
        // ONLINE状態
        statusDisplay.innerText = "● ONLINE";
        statusDisplay.style.color = "#2ecc71"; // 鮮やかな緑
        connectBtn.innerText = "切断する";
        connectBtn.style.backgroundColor = "#e74c3c"; // 赤系に変えて「切断」を強調
        console.log("Robot Connected");
    } else {
        // OFFLINE状態
        statusDisplay.innerText = "● OFFLINE";
        statusDisplay.style.color = "#95a5a6"; // グレー
        connectBtn.innerText = "ロボット接続";
        connectBtn.style.backgroundColor = ""; // 元のスタイルに戻す
        console.log("Robot Disconnected");
    }
});

//--- タブ切り替え ---
const bthTabs = document.querySelectorAll(".btn-tab");

bthTabs.forEach((btnTab) => {
  btnTab.addEventListener("click", () => {
    bthTabs.forEach((t) => t.classList.remove("active"));
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach((tabContent) => tabContent.classList.remove("active"));

    btnTab.classList.add("active");
    const tabIndex = Array.from(bthTabs).indexOf(btnTab);
    tabContents[tabIndex].classList.add("active");
  });
});

// --- スライダーの数値連動 ---
const speedInput = document.getElementById("speed");
const speedDisplay = document.getElementById("display-speed");
const accelInput = document.getElementById("accelarate");
const accelDisplay = document.getElementById("display-accelarate");

speedInput.addEventListener("input", () => {
    speedDisplay.innerText = speedInput.value;
});

accelInput.addEventListener("input", () => {
    accelDisplay.innerText = accelInput.value;
});

// --- Canvasの設定 ---
const canvas = document.getElementById("teaching-canvas");
const ctx = canvas.getContext("2d");

let currentX = 0; 
let currentY = 0;

function initCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 250; 
    currentX = canvas.width / 2;
    currentY = canvas.height / 2;
    drawStartPoint();
}

function drawStartPoint() {
    ctx.fillStyle = "#3498db";
    ctx.beginPath();
    ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
}

initCanvas();

// --- 登録と削除の機能  ---
const addBtn = document.getElementById("add-point");
const delBtn = document.getElementById("del-point");
const listContainer = document.getElementById("list-container");

// ▼ 登録ボタンの処理
addBtn.addEventListener("click", () => {
    const dirSelect = document.getElementById("direction");
    const directionValue = dirSelect.value;
    const directionText = dirSelect.options[dirSelect.selectedIndex].text;
    const distance = parseFloat(document.getElementById("input-distance").value) || 0;
    const speed = speedInput.value;
    const accel = accelInput.value;

    // 1. リストへの追加
    const newRecord = document.createElement("div");
    newRecord.className = "record-item";
    newRecord.innerHTML = `
        <span>${directionText}</span>
        <span>${distance}m</span>
        <span>${speed}</span>
        <span>${accel}</span>
    `;
    listContainer.appendChild(newRecord);

    // 2. Canvasへの描画
    const scale = 20; 
    const moveDist = distance * scale;

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#e67e22"; 
    ctx.moveTo(currentX, currentY);

    if (directionValue === "forward") {
        currentY -= moveDist;
    } else if (directionValue === "backward") {
        currentY += moveDist;
    } else if (directionValue === "rightturn") {
        currentX += moveDist;
    } else if (directionValue === "leftturn") {
        currentX -= moveDist;
    }

    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    ctx.fillStyle = "#333";
    ctx.fillRect(currentX - 5, currentY - 5, 10, 10);
    // 最後にサイクルタイムを更新
    updateCycleTime();
});

// ▼ 削除ボタンの処理
delBtn.addEventListener("click", () => {
    const lastItem = listContainer.lastElementChild;
    if (lastItem) {
        listContainer.removeChild(lastItem);
        // Canvasのリセット
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        initCanvas();
    } else {
        alert("削除するデータがありません");
    }
    // 最後にサイクルタイムを更新
    updateCycleTime();
});

// --- サイクルタイム計算機能 ---
const totalTimeDisplay = document.getElementById("total-time");

function updateCycleTime() {
    let totalSeconds = 0;

    // リストの全アイテムを取得（ヘッダー以外）
    const records = listContainer.querySelectorAll(".record-item");

    records.forEach(record => {
        // 表示テキストから数値を取り出す（例: "1.5m" -> 1.5）
        const spans = record.querySelectorAll("span");
        const dist = parseFloat(spans[1].innerText) || 0;
        const vel  = parseFloat(spans[2].innerText) || 0;
        const acc  = parseFloat(spans[3].innerText) || 0;

        if (vel > 0 && acc > 0) {
            // --- 簡易的な計算モデル ---
            // 1. 最高速度に達するまでの時間 t1 = v / a
            const t1 = vel / acc;
            // 2. 加速中に進む距離 d1 = 1/2 * a * t1^2
            const d1 = 0.5 * acc * (t1 ** 2);

            if (d1 <= dist) {
                // 加速後に定速走行がある場合
                const d2 = dist - d1;      // 残りの距離
                const t2 = d2 / vel;       // 定速走行時間
                totalSeconds += (t1 + t2);
            } else {
                // 最高速度に達する前に目標距離に着く場合 (三角加速)
                // dist = 1/2 * a * t^2  =>  t = sqrt(2 * dist / a)
                const t_tri = Math.sqrt((2 * dist) / acc);
                totalSeconds += t_tri;
            }
        }
    });

    // 小数点第2位まで表示
    totalTimeDisplay.innerText = totalSeconds.toFixed(2);
}



// --- 手動タブの状態表示 ---

const manualSpeedInput = document.getElementById("manual-speed");
const manualSpeedVal = document.getElementById("manual-speed-val");

manualSpeedInput.addEventListener("input", () => {
    manualSpeedVal.innerText = manualSpeedInput.value;
});
