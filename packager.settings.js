var packager = require('electron-packager');
const pgk = require('./package.json');

var opts = {
    // mac  =>  "arch": "all", "platform": "darwin"
    // win  =>  "arch": "ia32", "platform": "win32"
    "name": "设置端",
    "arch": "all",
    "platform": "darwin",
    // "dir": "./",
    "dir": './build/settings/',
    "appCopyright": "123",
    "appVersion": pgk.version,
    "asar": false,
    // Whether to package the application's source code into an archive
    // "icon": "./public/icons/mac/icon.png.icns",
    // "out": `./GUI/darwin/${pgk.version}`,
    "out": `./GUI/mac/`,
    "overwrite": true,
    "prune": true,
    // "electronVersion": "3.0.9",
    "electronVersion": "2.0.14",    
};

// mac
packager(opts)
    .then(appPaths => {
        console.log('mac out --> ' + appPaths);
    });

// win
packager({
    ...opts,
    ...{
        arch: 'ia32',
        platform: 'win32',
        // "icon": "./public/icons/win/icon.png.ico",
        // "out": `./GUI/win32/${pgk.version}`,
        "out": `./GUI/win/`,
    }
}).then(appPaths => {
    console.log('win out --> ' + appPaths);
});