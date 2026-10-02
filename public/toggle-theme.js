// 保存済みのテーマ → OS の設定の順で決める
let themeValue = localStorage.getItem("theme")
  || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

function setPreference() {
  localStorage.setItem("theme", themeValue);
  reflectPreference();
}

function reflectPreference() {
  document.firstElementChild.setAttribute("data-theme", themeValue);

  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);
}

// set early so no page flashes / CSS is made aware
reflectPreference();

function init() {
  // set on load so screen readers can get the latest value on the button
  reflectPreference();

  // now this script can find and listen for clicks on the control
  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    themeValue = themeValue === "light" ? "dark" : "light";
    setPreference();
  });
}

// window.onload だと画像読み込み完了までボタンが効かないため DOMContentLoaded で登録する
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// sync with system changes (ユーザーが手動選択済みの場合は上書きしない)
window.matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({matches: isDark}) => {
    if (localStorage.getItem("theme")) return;
    themeValue = isDark ? "dark" : "light";
    reflectPreference();
  });
