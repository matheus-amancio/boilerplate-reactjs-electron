const { app, BrowserWindow, ipcMain, dialog } = require('electron')

const fs = require("fs")
const path = require('path')
const isDev = require('electron-is-dev')

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            preload: path.join(__dirname, "preload.js")
        }
    })

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    )
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// ipcMain
ipcMain.on("save-file", (event, content) => {
    dialog.showSaveDialog({
        // Restricting the user to only Text Files.
        filters: [
            {
                name: 'Text Files',
                extensions: ['txt']
            }, ],
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        // console.log(file.canceled);
        if (!file.canceled) {
            // console.log(file.filePath.toString());
              
            // Creating and Writing to the sample.txt file
            fs.writeFile(file.filePath.toString(), 
                         content, function (err) {
                if (err) throw err;
                console.log(`Saved in ${file.filePath.toString()}!`);
            });
        }
    }).catch(err => {
        console.log(err)
    });
});

ipcMain.on("open-file", (event, arg) => {
    dialog.showOpenDialog({
        filters: [{
            name: "Text Files",
            extensions: ['txt']
        }],
        properties: ["openFile"]
    })
        .then(file => {
            // console.log(file.filePaths.toString())
            // console.log(file.canceled)
            if(!file.canceled) {
                const data = fs.readFileSync(file.filePaths.toString()).toString()
                // console.log(data)
                event.reply("resp-main", data)
            }
        })
        .catch(err => console.log(err))
})