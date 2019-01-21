const fs = require('fs-extra');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const paths = require('./paths');

fs.emptyDirSync(paths.appBuildSettings);
// fs.emptyDirSync(paths.appGui);

const excludeList = [
    paths.appBuild,
    paths.appBuildSettings,
    paths.appBuildIndex,
    paths.appGui,
    ...paths.appExtra,
    paths.pageIndex,
    paths.pkgIndex,
]

console.log(`> copying ${paths.appPublic} -> ${paths.appBuildSettings}`);
fs.copySync(paths.appPublic, paths.appBuildSettings, {
    dereference: true,
    filter: file => {
        if (file.endsWith(".xml")) {
            return false
        }
        if (excludeList.some(x => file.includes(x))) { // 不打包的文件列表
            return false
        }
        return true
    },
});
console.log(`> copied ${paths.appPublic} -> ${paths.appBuildSettings}\n`);

// 复制main.js
fs.copySync(resolveApp('./main.settings.js'), resolveApp('./build/settings/main.js'));