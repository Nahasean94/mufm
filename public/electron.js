const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = require('electron').ipcMain
const path = require('path')

const isDev = require('electron-is-dev')
const uploadDir = `./db.db`


const Datastore = require('nedb')
db = new Datastore({
    filename: uploadDir,
    autoload: true
})


let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200, height: 780, resizable: true, webPreferences: {
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
    db.insert(arg, function (err, newDoc) {   // Callback is optional
        event.sender.send('saved-file', newDoc)
    })

})
ipc.on('get-playlist', (event, arg) => {
    db.find({date: arg}).sort({id: 1}).exec((err, docs) => {
        event.sender.send('got-playlist', docs)
    })

})
ipc.on('delete-file', (event, arg) => {
    db.remove({id: arg}, function (err, docs) {
        event.sender.send('deleted', docs)
    })
})
