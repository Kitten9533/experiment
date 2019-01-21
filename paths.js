const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

module.exports = {
  appBuild: resolveApp('build'),
  appBuildSettings: resolveApp('build/settings'),
  appBuildIndex: resolveApp('build/index'),
  appPublic: resolveApp('./'),
  appGui: resolveApp('GUI'),
  pageIndex: resolveApp('./index.html'),
  pageSettings: resolveApp('./settings.html'),
  pkgIndex: resolveApp('./packager.index.js'),
  pkgSettings: resolveApp('./packager.settings.js'),
  appExtra: [
    resolveApp('./.gitignore'),
    resolveApp('./packager.js'),
    resolveApp('./packagerIndex.js'),
    resolveApp('./packagerSettings.js'),
    resolveApp('./README.md'),
    resolveApp('./paths.js'),
    resolveApp('./main.index.js'),
    resolveApp('./main.settings.js'),
    resolveApp('./main.js'),
  ],
};
