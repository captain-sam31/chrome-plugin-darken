
console.log('this is static_inject.js');

const selfClass = 'magic_dark';

chrome.runtime.onMessage.addListener(handleMessage);
// 监听插件的消息
function handleMessage(res) {
  if (res.msg === 'changeMode') {
    changeMode(res.data);
  }
}
// 切换颜色模式
function changeMode(data) {
  const bodys = document.querySelectorAll('body');
  bodys?.forEach((elem) => {
    const oldClass = elem.getAttribute('class') || '';
    const newClass = data === 'dark' ? `${oldClass} ${selfClass}` : oldClass.replaceAll(selfClass, '');
    elem.setAttribute('class', newClass);
  })
  getCurrMode();
}
// 通知插件 当前的颜色模式
function getCurrMode() {
  const bodys = document.querySelectorAll('body');
  const currClass = bodys[0]?.getAttribute('class') || '';
  chrome.runtime.sendMessage({ msg: 'saveCurrMode', data: currClass.includes(selfClass) ? 'dark' : 'light' });
}
// 页面加载完，通知一下插件 当前的模式
window.onload = () => {
  getCurrMode();
}