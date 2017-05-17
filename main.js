const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')


var mainWindow = null

function createWindow(){

	mainWindow = new BrowserWindow(
	{
		height:678,
		width:1351
	})
	

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'app' ,'index.html'),
		protocol: 'file:',
		slashes: true

	}))

	// mainWindow.loadURL('https://github.com')

	// mainWindow.webContents.openDevTools()

	  // Emitted when the window is closed.
	mainWindow.on('closed', () => {
	// Dereference the window object, usually you would store windows
	// in an array if your app supports multi windows, this is the time
	// when you should delete the corresponding element.
	mainWindow = null
	})


}



app.on('ready', createWindow)