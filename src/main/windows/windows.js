const { app, ipcMain, clipboard } = require('electron');
const path = require('path');
const accountWindow = require('./accountWindow');
const mainAppWindow = require('./mainAppWindow');
const monitorWindow = require('./monitorWindow');
const BrowserHistory = require('node-browser-history');
const { readyToShow } = require('../util/events');
exports.createWindow = async () => {
  console.log(process.env.PASSWORD);
  const { setCookies, getCookie, removeCookies } = require('./cookies');
  const modelsPath = app.isPackaged
    ? path.join(process.resourcesPath, 'public', 'models')
    : path.join(__dirname, '../../renderer/public/models');
  ipcMain.handle('paths', () => {
    return { modelsPath };
  });
  let mainWindow;
  let accWindow;
  let monitWindow;

  const cookie = await getCookie('isLogin');
  if (cookie.length > 0) {
    mainWindow = mainAppWindow.createAppWindow(false);
    mainWindow.on(readyToShow, () => {
      mainWindow.show();
    });
  } else {
    accWindow = accountWindow.createAccountWindow(false);
    accWindow.on(readyToShow, () => {
      accWindow.show();
    });
  }

  ipcMain.on('exitApp', (_e) => {
    app.quit();
  });
  ipcMain.on('openMonitorWindow', (_e) => {
    if (!monitWindow) {
      monitWindow = monitorWindow.createMonitorWindow(false);
    }
    monitWindow.on(readyToShow, () => {
      monitWindow.show();
    });
    monitWindow.on('closed', () => {
      monitWindow = null;
    });
  });

  ipcMain.on('login', (_e, isLogin) => {
    setCookies(isLogin);
    accWindow.close();
    mainWindow = mainAppWindow.createAppWindow(false);
    mainWindow.on('ready-to-show', () => {
      mainWindow.show();
    });
  });
  ipcMain.on('logout', (_e) => {
    removeCookies('https://dlsms.com', 'isLogin');
    mainWindow.close();
    accWindow = accountWindow.createAccountWindow(false);
    accWindow.on('ready-to-show', () => {
      accWindow.show();
    });
  });

  ipcMain.on('copyCode', (_e, code) => {
    clipboard.writeText(code);
  });
};
