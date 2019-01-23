const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const debug = /--debug/.test(process.argv[2])

const ipc = electron.ipcMain   //页面与main.js通信

const express = require('express')();
const http = require('http').Server(express);
const io = require('socket.io')(http);
const port = 8099; // socket监听的端口

// 修改为只在展示端查看
http.listen(port, '0.0.0.0', function () {
  console.log(`listening on *:${port}`);
});

var mainWindow = null;
// const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
//   if (mainWindow) {
//     if (mainWindow.isMinimized()) mainWindow.restore()
//     mainWindow.focus()
//   }
// })

// if (shouldQuit) {
//   app.quit()
// }

function createWindow() {
  var options = {
    autoHideMenuBar: true,
    skipTaskbar: true,
    fullscreen: false,
    fullscreenable: true,
    webPreferences: {
      webSecurity: false,
      preload: true,
    },
    // icon: path.join(__dirname, 'public/icons/png/64x64.png')
  };

  if (debug) {
    options.fullscreen = false;
    options.frame = false;
    options.width = 960;
    options.height = 768;
  }


  console.log('options', options);

  mainWindow = new BrowserWindow(options);

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  // mainWindow.loadFile('settings.html')

  if (debug) { // 发布后可以通过配置xml来显示控制台
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('did-finish-load', function (e) {
    if (debug) {
      // 调试模式下设置缩放比例
      mainWindow.webContents.setZoomFactor(0.75);
    } else {
      mainWindow.webContents.setZoomFactor(1);
      mainWindow.webContents.setVisualZoomLevelLimits(1, 1);
      mainWindow.webContents.setLayoutZoomLevelLimits(1, 1);
    }
  })

  mainWindow.webContents.on('did-fail-load', (event) => {
    setTimeout(() => {
      mainWindow.loadFile('index.html')
    }, 1000)
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  mainWindow.on('minimize', function () {
    mainWindow.restore()
  })
  
  mainWindow.webContents.on('crashed', (event, killed) => {
    mainWindow.reload()
  })

  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
    socket.on('msg', function (data) {
      mainWindow.webContents.send('msg', data);
    })
  });
}

app.on('ready', function () {
  createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
// app.on('quit', function () {
//   process.exit(0);
// })

// 应用退出
ipc.on('app-quit', (event, index) => {
  app.quit()
})

ipc.on('toggle-full-screen', (event) => {
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
})