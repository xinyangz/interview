# Interview Platform

**最新更新:**

API已更新

以往更新：

[10.10会议记录](docs/meeting/meeting_1_161010.md)

请管理平台组查看[迭代开发计划](docs/迭代开发计划.xlsx)领任务

------------------------------------------

## Setup
请参见脚手架工程说明

## Server Stub

工程添加了server stub用于模拟服务器，以便前端开发。stub使用swagger-codegen生成，并添加了延时，在调用时会有500ms相应延时。
server stub的url是`http://localhost:3030`，前端进行异步调用时，请使用这个地址。
在运行时，也可以在浏览器中打开`http://localhost:3030/docs`以查看及试用api。

请注意为了方便起见，**server stub使用的是http协议，而非https协议**。

如果需要修改服务器返回的数据，请到`./stub/controllers`目录下修改相应文件。

## API文档
### 查看
运行`npm run doc`查看API文档。或者在`WebStorm`中安装`Swagger Pluggin`，打开`api/swagger/swagger.yaml`，点击右上角浏览器图标查看。

### 编辑
运行`swagger project edit`编辑API文档。或者在`WebStrom`中安装`Swagger Pluggin`直接编辑`api/swagger/swagger.yaml`

### 示例文档
`api/swagger/`目录下有两份API示例文档`example_aios`和`example_petstore`，供参考

### 依赖
查看文档时，如果gulp报错，可能需要安装`gulp cli`:
```
npm install --global gulp-cli
```
如果http-server报错，请安装:
```
npm install --global http-server
```
编辑时，如果swagger报错，请安装:
```
npm install --global swagger
```

## 项目文档
项目文档存储在docs目录下

---
以下为脚手架工程文档

# React Slingshot!

[![Build status: Linux](https://img.shields.io/travis/coryhouse/react-slingshot.svg?style=flat-square)](https://travis-ci.org/coryhouse/react-slingshot)
[![Build status: Windows](https://ci.appveyor.com/api/projects/status/ky0npqkot20ieiak?svg=true)](https://ci.appveyor.com/project/coryhouse/react-slingshot/branch/master)
[![Dependency Status](https://david-dm.org/coryhouse/react-slingshot.svg?style=flat-square)](https://david-dm.org/coryhouse/react-slingshot)
[![Coverage Status](https://coveralls.io/repos/github/coryhouse/react-slingshot/badge.svg?branch=master)](https://coveralls.io/github/coryhouse/react-slingshot?branch=master)

React Slingshot is a comprehensive starter kit for rapid application development using React. 

Why Slingshot?

1. **One command to get started** - Type `npm start` to start development in your default browser.
2. **Rapid feedback** - Each time you hit save, changes hot reload and linting and automated tests run.
3. **One command line to check** - All feedback is displayed on a single command line.
4. **No more JavaScript fatigue** - Slingshot uses the most popular and powerful libraries for working with React.
5. **Working example app** - The included example app shows how this all works together.
6. **Automated production build** - Type `npm run build` to do all this:

[![React Slingshot Production Build](https://img.youtube.com/vi/qlfDLsX-J0U/0.jpg)](https://www.youtube.com/watch?v=qlfDLsX-J0U)

## Get Started
1. **Initial Machine Setup**. First time running the starter kit? Then complete the [Initial Machine Setup](https://github.com/coryhouse/react-slingshot#initial-machine-setup).
2. **Clone the project**. `git clone https://github.com/coryhouse/react-slingshot.git`.
3. **Run the setup script**. `npm install`
4. **Run the example app**. `npm start -s`
This will run the automated build process, start up a webserver, and open the application in your default browser. When doing development with this kit, this command will continue watching all your files. Every time you hit save the code is rebuilt, linting runs, and tests run automatically. Note: The -s flag is optional. It enables silent mode which suppresses unnecessary messages during the build.
5. **Review the example app.** This starter kit includes a working example app that calculates fuel savings. Note how all source code is placed under /src. Tests are placed alongside the file under test. The final built app is placed under /dist. These are the files you run in production.
6. **Delete the example app files.** Once you're comfortable with how the example app works, you can [delete those files and begin creating your own app](https://github.com/coryhouse/react-slingshot/blob/master/docs/FAQ.md#i-just-want-an-empty-starter-kit). 

## Initial Machine Setup
1. **Install [Node 4.0.0 or greater](https://nodejs.org)** - (5.0 or greater is recommended for optimal build performance). Need to run multiple versions of Node? Use [nvm](https://github.com/creationix/nvm).
2. **Install [Git](https://git-scm.com/downloads)**. 
3. **[Disable safe write in your editor](http://webpack.github.io/docs/webpack-dev-server.html#working-with-editors-ides-supporting-safe-write)** to assure hot reloading works properly.
4. On a Mac? You're all set. If you're on Linux or Windows, complete the steps for your OS below.  
 
**On Linux:**  

 * Run this to [increase the limit](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc) on the number of files Linux will watch. [Here's why](https://github.com/coryhouse/react-slingshot/issues/6).    
`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p` 

**On Windows:** 
 
* **Install [Python 2.7](https://www.python.org/downloads/)**. Some node modules may rely on node-gyp, which requires Python on Windows.
* **Install C++ Compiler**. Browser-sync requires a C++ compiler on Windows. [Visual Studio Express](https://www.visualstudio.com/en-US/products/visual-studio-express-vs) comes bundled with a free C++ compiler. Or, if you already have Visual Studio installed: Open Visual Studio and go to File -> New -> Project -> Visual C++ -> Install Visual C++ Tools for Windows Desktop. The C++ compiler is used to compile browser-sync (and perhaps other Node modules).

## Technologies
Slingshot offers a rich development experience using the following technologies:

| **Tech** | **Description** |**Learn More**|
|----------|-------|---|
|  [React](https://facebook.github.io/react/)  |   Fast, composable client-side components.    | [Pluralsight Course](https://www.pluralsight.com/courses/react-flux-building-applications)  |
|  [Redux](http://redux.js.org) |  Enforces unidirectional data flows and immutable, hot reloadable store. Supports time-travel debugging. Lean alternative to [Facebook's Flux](https://facebook.github.io/flux/docs/overview.html).| [Pluralsight Course](http://www.pluralsight.com/courses/react-redux-react-router-es6)    |
|  [React Router](https://github.com/reactjs/react-router) | A complete routing library for React | [Pluralsight Course](https://www.pluralsight.com/courses/react-flux-building-applications) |
|  [Babel](http://babeljs.io) |  Compiles ES6 to ES5. Enjoy the new version of JavaScript today.     | [ES6 REPL](https://babeljs.io/repl/), [ES6 vs ES5](http://es6-features.org), [ES6 Katas](http://es6katas.org), [Pluralsight course](https://www.pluralsight.com/courses/javascript-fundamentals-es6)    |
| [Webpack](http://webpack.github.io) | Bundles npm packages and our JS into a single file. Includes hot reloading via [react-transform-hmr](https://www.npmjs.com/package/react-transform-hmr). | [Quick Webpack How-to](https://github.com/petehunt/webpack-howto) [Pluralsight Course](https://www.pluralsight.com/courses/webpack-fundamentals)|
| [Browsersync](https://www.browsersync.io/) | Lightweight development HTTP server that supports synchronized testing and debugging on multiple devices. | [Intro vid](https://www.youtube.com/watch?time_continue=1&v=heNWfzc7ufQ)|
| [Mocha](http://mochajs.org) | Automated tests with [Chai](http://chaijs.com/) for assertions and [Enzyme](https://github.com/airbnb/enzyme) for DOM testing without a browser using Node. | [Pluralsight Course](https://www.pluralsight.com/courses/testing-javascript) |
| [Isparta](https://github.com/douglasduteil/isparta) | Code coverage tool for ES6 code transpiled by Babel. | 
| [TrackJS](https://trackjs.com/) | JavaScript error tracking. | [Free trial](https://my.trackjs.com/signup)|  
| [ESLint](http://eslint.org/)| Lint JS. Reports syntax and style issues. Using [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) for additional React specific linting rules. | |
| [SASS](http://sass-lang.com/) | Compiled CSS styles with variables, functions, and more. | [Pluralsight Course](https://www.pluralsight.com/courses/better-css)|
| [PostCSS](https://github.com/postcss/postcss) | Transform styles with JS plugins. Used to autoprefix CSS |
| [Editor Config](http://editorconfig.org) | Enforce consistent editor settings (spaces vs tabs, etc). | [IDE Plugins](http://editorconfig.org/#download) |
| [npm Scripts](https://docs.npmjs.com/misc/scripts)| Glues all this together in a handy automated build. | [Pluralsight course](https://www.pluralsight.com/courses/npm-build-tool-introduction), [Why not Gulp?](https://medium.com/@housecor/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8#.vtaziro8n)  |

The starter kit includes a working example app that puts all of the above to use.
## Questions?
Check out the [FAQ](/docs/FAQ.md)
