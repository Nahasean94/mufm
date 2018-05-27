const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = require('electron').ipcMain
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./public/media/db.json')
const db = low(adapter)

db.defaults({playlists: []})
    .write()

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200, height: 780, resizable: false, webPreferences: {
            webSecurity: false
        }
    })
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
    mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})


ipc.on('save-playlist', (event, arg) => {
    //check if an entry with that date exists
    if (db.get('playlists')
        .find({date: arg.date}).write()) {
//if it exists, update it
        db.get('playlists')
            .find({date: arg.date}).assign({playlist: arg.playlist}).write()
    } else {
        db.get('playlists').push(arg).write()
    }
    // event.sender.send('asynchronous-reply', 'pong')
})
ipc.on('get-playlist', (event, arg) => {
    const entry = db.get('playlists')
        .find({date: arg}).write()
    if (entry) {
        const playlist = entry.playlist
        event.sender.send('got-playlist', playlist)
    }
})