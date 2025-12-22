const bthTabs = document.querySelectorAll(".btn-tab");

bthTabs.forEach((btnTab) => {
  btnTab.addEventListener("click", () => {
    // すべてのタブボタンから active を消す
    bthTabs.forEach((t) => {
      t.classList.remove("active");
    });

    // すべてのコンテンツを非表示にする
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("active");
    });

    // クリックされたタブをアクティブにする
    btnTab.classList.add("active");

    // 対応するコンテンツを表示
    const tabIndex = Array.from(bthTabs).indexOf(btnTab);
    tabContents[tabIndex].classList.add("active");
  });
});

// // 使う部品（ボタンや入力欄）を取得する
// const addBtn = document.getElementById("add-point"); // 登録ボタン
// const recordList = document.getElementById("record-list"); // リストを表示するエリア

// addBtn.addEventListener("click", () => {
//   // 1. 各入力欄から現在の値を取得する
//   const direction = document.getElementById("direction").options[document.getElementById("direction").selectedIndex].text; // 選択されたテキスト（前進など）
//   const distance = document.getElementById("input-distance").value;
//   const speed = document.getElementById("speed").value;
//   const accelarate = document.getElementById("accelarate").value;

//   // 2. リストに表示するための「新しい1行」を作成する
//   // 読みやすいように <p> タグの中にデータを並べます
//   const newRecord = document.createElement("p");
//   newRecord.className = "record-item"; // スタイル調整用にクラス名をつけておく
//   newRecord.innerHTML = `
//     <span>${direction}</span>
//     <span>${distance}m</span>
//     <span>${speed}m/s</span>
//     <span>${accelarate}m/s²</span>
//   `;

//   // 3. 実際の画面（登録リスト）に追加する
//   // 「削除」ボタンより上に挿入されるようにします
//   const delBtnParent = document.getElementById("del-point").parentNode;
//   recordList.insertBefore(newRecord, delBtnParent);
// });

// // --- 4. 削除機能 ---
// const delBtn = document.getElementById("del-point");

// const listContainer = document.getElementById("list-container");

// delBtn.addEventListener("click", () => {
//     // 1. リストの箱（list-container）の中にある「最後の子要素」を探す
//     const lastItem = listContainer.lastElementChild;

//     // 2. もし最後の子要素があれば、それを箱から削除する
//     if (lastItem) {
//         listContainer.removeChild(lastItem);
//     } else {
//         // 何も無いときはアラートを出す（動作確認用）
//         alert("削除する項目がありません");
//     }
// });

// --- 登録と削除の機能 ---
const addBtn = document.getElementById("add-point");
const delBtn = document.getElementById("del-point");
const listContainer = document.getElementById("list-container"); // 専用の箱を取得

// ▼ 登録ボタンの処理
addBtn.addEventListener("click", () => {
    const dirSelect = document.getElementById("direction");
    const directionText = dirSelect.options[dirSelect.selectedIndex].text;
    const distance = document.getElementById("input-distance").value;
    const speed = document.getElementById("speed").value;
    const accel = document.getElementById("accelarate").value;

    const newRecord = document.createElement("div");
    newRecord.className = "record-item";
    newRecord.innerHTML = `
        <span>${directionText}</span>
        <span>${distance}m</span>
        <span>${speed}</span>
        <span>${accel}</span>
    `;

    // 箱の中に新しい行を追加
    listContainer.appendChild(newRecord);
});

// ▼ 削除ボタンの処理
delBtn.addEventListener("click", () => {
    // 箱の中にある「最後の子要素（一番新しい登録）」を探す
    const lastItem = listContainer.lastElementChild;

    if (lastItem) {
        // あれば削除する
        listContainer.removeChild(lastItem);
    } else {
        alert("削除するデータがありません");
    }
});
