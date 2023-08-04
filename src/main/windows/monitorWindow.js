const { BrowserWindow,screen } = require('electron');
const path = require('path');
const windowStateKeeper = require('electron-window-state')

exports.createMonitorWindow = (isShow) => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    let winState = windowStateKeeper({
        defaultWidth: width,
        defaultHeight: height,
    })
    const monitorWindow = new BrowserWindow({
      width: winState.width,
      height: winState.height,
      x: winState.x,
      y: winState.y,
      webPreferences: {
        preload: path.join(__dirname, "../../preload/preload.js"),
      },
      autoHideMenuBar: true,
      titleBarStyle: "hidden",
      titleBarOverlay: {
        color: "#064f32",
        symbolColor: "white",
        height: 40,
      },
      title: "monitor",

      show: isShow,
      icon: path.join(__dirname, "../../public/assets/logo/dlsms2.png"),
    });
    monitorWindow.loadFile(path.join(__dirname, "../../public/monitor.html"));
    winState.manage(monitorWindow)
    return monitorWindow;
}