'use strict';

const qs = require ("querystring");
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

const pdfURL = "http://cregut.perso.enseeiht.fr/ENS/2016-1in-tob/CONTENU/to-1in-2016-cm-04-sujet.pdf";

app.on('ready', function() {
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
  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
