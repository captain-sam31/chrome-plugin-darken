// 官网示例：https://developer.chrome.com/docs/extensions/samples

// 插件安装完成事件
// chrome.runtime.onInstalled.addListener(async () => {
//   // 动态加载 插件浮窗页面（manifest.json中配置属于静态加载）
//   await chrome.action.setPopup({
//     popup: "./popup/popup.html"
//   });
// })
// 点击插件图标事件（若manifest.json的action配置了popup内容，该事件会失效，无论动态还是静态加载）
// chrome.action.onClicked.addListener((tab) => {
//   console.log('action.onClicked', tab);
// })
// 目标网页加载完，动态注入js文件（也可以在manifest.json配置content_scripts，这属于静态注入）
chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId, url }) => {
  const { options } = await chrome.storage.local.get('options');
  if (url.startsWith('http')) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['./scripts/dynamic_inject.js'],
      // 使注入的js与目标页面 运行在同一个进程（api和变量 都可以互通），不写的话 则相互隔离
      world: 'MAIN',
      ...options
    });
  }
});
// 存储当前模式
let currMode = 'light';
// 监听content_script和popup的事件（由于 目标网页 无法发消息 给插件，所以用background.js作为中间商来 暂存消息）
chrome.runtime.onMessage.addListener((res, sender, sendResponse) => {
  if (res.msg === 'saveCurrMode') {
    currMode = res.data || 'light';
  } else if (res.msg === 'getCurrMode') {
    sendResponse({ data: currMode });
  }
});