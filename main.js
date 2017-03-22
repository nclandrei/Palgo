const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

require('electron-reload')(__dirname);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1281,
        height: 800,
        minWidth: 1281,
        minHeight: 800,
        backgroundColor: 'white',
        show: false
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'welcome.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function () {
        mainWindow = null
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
