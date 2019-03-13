'use strict'

//Create electron App
const electron = require('electron')
// renderrer element
const {ipcMain}= require('electron');
//refresh data
require('electron-reload')(__dirname);
// Database
const DataStore = require('./DataStore')
//chat app
const Chatkit = require('pusher-chatkit-server')
const chatkit = new Chatkit.default({
    instanceLocator: 'v1:us1:ed63e27b-a829-427d-b30d-f9d3818d59d7',
    key: '39cf2826-d08a-4112-8ab9-102d41552261:kaw8eiUL7gTnbX/z1OSbhFPUZLP/ksoplGoe5aMadyE='
})


// create a new todo store
const store = new DataStore({ name: 'Ma_Todo_Liste' })

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600, frame :false, icon:`${__dirname}/views/icons/png/app.png`})
    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/views/index.html`)
    // Send data to todolist.js
     mainWindow.webContents.on('did-finish-load', ()=>{
        mainWindow.webContents.send('store-data',store)
    })
    // delete-todo from todo list window
    ipcMain.on('delete-todo', (event, todo) => {
        // Delete todo to db

        const updatedTodos = store.deleteTodo(todo).todos
        mainWindow.webContents.send('store-data',updatedTodos)
        mainWindow.reload()
    })
    ipcMain.on('add-user-chat' ,(event,arg) =>{
        // add user to tchat
        chatkit.createUser({
            id: arg,
            name: arg
        })
          .then(() => {
              console.log('User created successfully');
          }).catch((err) => {
          console.log("erreur main.js")
          console.log(err);
      })

    })
    ipcMain.on('add-todo' ,(event,todo) =>{
        // add todo to db
        const updatedTodos = store.addTodo(todo).todos
        mainWindow.webContents.send('store-data', updatedTodos)
        //mainWindow.reload()
    })
    // Open the DevTools.
    mainWindow.webContents.openDevTools()



}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
    createWindow()

    //send data
   /* mainWindow.webContents.on('did-finish-load', ()=>{
        mainWindow.webContents.send('store-data',store)
    })*/

})

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
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them her
