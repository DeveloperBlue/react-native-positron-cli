/* eslint strict: 0 */
'use strict';

const { app, BrowserWindow, ipcMain, shell} = require('electron');

const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const project_bundle_name = require('../app.json').name;

const isDevelopment = (argv && argv.mode === 'development');

const BUILD_PATH = path.join(__dirname, (isDevelopment) ? '/__webpack-dev-server__' : '/build');

/* */

let mainWindow = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor : '#ec444b',
    webPreferences : {
      preload: path.join(BUILD_PATH, `${project_bundle_name}-preload.bundle.js`)
    }
  });

  mainWindow.webContents.openDevTools();

  mainWindow.loadFile(path.join(BUILD_PATH, 'index.html'));

  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

})

ipcMain.on("toMain", (event, arg) => {
  console.log(`Received message '${arg}' from a renderer process`);  
  event.sender.send('fromMain', 'Hello from the Electron main process!');
})