'use strict';

const qs = require("querystring");
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var pdfIndex = process.argv.indexOf("--pdf") + 1;
var devIndex = process.argv.indexOf("-dev");

var mainWindow = null;

var pdfURL = process.argv[pdfIndex];
// is it an absolute path or a relative one (in that case, add ./../../ to the path) ?
if (pdfURL.charAt(0) != '/') {
    pdfURL = './../../' + pdfURL;
}

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            webSecurity: false,
        },
    });
    const param = qs.stringify({file: pdfURL});

    mainWindow.loadURL('file://' + __dirname + '/pdfjs/web/viewer.html?' + param);

    if (devIndex != -1) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
