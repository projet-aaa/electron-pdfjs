# JetPack PDF viewer 

A PDF viewer connected with the Jetpack platform.

## Features

Jetpack PDF viewer is a PDF viewer using technologies to connect with the Jetpack platform and easily display questions and answers on your presentation screen.

Using Jetpack PDF viewer allow you to : 

 - Display your PDF
 - Connect to a Session Room to display on screen the current question and answers 
 - Send page number to the platform on page change. Thus you can find where students have encountered issues during your lecture.

## Install

Get the latest relase on [our release page]() and install it on your computer.

## Launch

Once you have downloaded the app, you can launch it easily. Example : `$ ./electron-pdfjs-linux-x64/electron-pdfjs `

The available options are : 

`-dev` to open dev tools

`--pdf YOUR_PDF_PATH` to open a given pdf

Example `./electron-pdfjs-linux-x64/electron-pdfjs  -dev --pdf ./shell.pdf`

If no pdf is selected, you will have the opportunity to select it in the top bar.

## Configuration

You can configure API and websocket URL thanks to the config.json file.
It is rather self-explanatory.

```json
{
  "socket": "https://jetpack0.trendio.fr:8080",
  "api": "https://jetpack0.trendio.fr/api"
}
```
If you create a config.json file at the root of Jetpack PDF viewer, it will override the default one.

## Developer

To hack on PDF viewer, install Nodejs and npm (node's package manager). 
The following process has been tested with :

```bash
$ node --version
v4.2.6
$ npm --version
3.5.2
```

Then clone this repository, install dependencies and launch the viewer

```bash
git clone https://github.com/projet-aaa/electron-pdfjs.git
cd electron-pdfjs
npm install
./node_modules/electron/dist/electron . 
```

To build a relase, install electron packager and build the viewer.

```bash
npm install electron-packager
./node_modules/electron-packager/cli.js .
```

## Notes

The PDF viewer has a polling system to connect to a room, thus you can open it before or after the opening of a room without any issue.

To login in the Jetpack PDF viewer, your credentials are : your INP id, your password (displayed on your jetpack platform's profile page).

As for socket URL configuration, we use Socket.io for websockets, thus providing an http URL instead of a ws one is not an issue. Socket.io will automatically change its protocol if it can.

On wifinp, there are some known bugs if the server used port for websocket is different from 8080.

This PDF viewer relies on Electron : Electron is a framework for creating native, cross-platform applications with web technologies like
 JavaScript, HTML, and CSS. As for PDF viewer we uses the great PDFjs library.