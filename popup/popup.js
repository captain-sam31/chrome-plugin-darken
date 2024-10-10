
console.log('popup.js');

window.onload = () => {
  const btn = document.querySelectorAll('.btn')[0];
  btn.addEventListener('click', toggole);
  initBtn();
}
// 获取当前模式，初始化按钮样式
async function initBtn() {
  // 向background.js获取 目前网页 暂存的数据
  chrome.runtime.sendMessage({ msg: 'getCurrMode' }, (res) => {
    const mode = res.data;
    const btn = document.querySelectorAll('.btn')[0];
    const toClass = mode === 'dark' ? 'light_btn' : 'dark_btn';
    btn.setAttribute('class', `btn ${toClass}`);
    btn.innerHTML = mode === 'dark' ? 'Lighten' : 'Darken';
  });
}
// 切换按钮样式
function toggole() {
  const btn = document.querySelectorAll('.btn')[0];
  const currClass = btn.getAttribute('class');
  const toClass = currClass.includes('dark') ? 'light_btn' : 'dark_btn';
  btn.setAttribute('class', `btn ${toClass}`);
  btn.innerHTML = currClass.includes('dark') ? 'Lighten' : 'Darken';
  // 通知目标页面
  noticeTarget(currClass.includes('dark') ? 'dark' : 'light');
}
// 通知目标页面（tabs需在manifest.json中授权）
async function noticeTarget(mode) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    chrome.tabs.sendMessage(tab.id, { msg: 'changeMode', data: mode });
  } else {
    alert("can not get 'tab' instance");
  }
}