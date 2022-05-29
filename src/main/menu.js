//创建菜单
/*

var electron=require('electron');

var Menu=electron.Menu;

vscode里面实现代码提示功能：
    在当前项目安装一下  electron模块。

      "dependencies": {
        "electron": "^2.0.4"
    }


https://electronjs.org/docs/api/menu-item
*/

const { Menu } = require('electron')
const BrowserWindow = require('electron').BrowserWindow
const dialog = require('electron').dialog
const { ipcRenderer: ipc } = require('electron')
const ipcMain = require('electron').ipcMain
//订单菜单
var template = [
  {
    label: 'File',
    submenu: [
      {
        label: '关于H•rise',
        role: 'copy'
      },
      {
        label: '退出',
        role: 'close'
      }
    ]
  },

  {
    label: '文件',
    submenu: [
      {
        label: '新建文件...',

        accelerator: 'ctrl+n',

        click: function() {
          console.log('ctrl+n')
        }
      },
      {
        type: 'separator'
      },
      {
        label: '打开...',
        click: function() {
          dialog
            .showOpenDialog({
              title: '打开文件',
              defaultPath: '',
              properties: ['openFile'],
              // properties: ['openFile', 'multiSelections'],
              filters: [{ name: 'Text', extensions: ['md'] }]
            })
            .then(result => {
              if (!result.canceled && result.filePaths.length > 0) {
                console.log(result.filePaths[0])
                console.log(BrowserWindow.getFocusedWindow().webContents)
                console.log(
                  BrowserWindow.getFocusedWindow().webContents.send(
                    'img-files',
                    result.filePaths[0]
                  )
                )
                // console.log(BrowserWindow.getFocusedWindow().webContents.send('img-files',result.filePaths[0]))
                // this.$emitNode("tradeMenu", "open", result.filePaths[0]);
                // //  监听主进程读完文件数据
                // this.$onNodeOnce("tradeMenuOpen", (event, arg) => {
                //     let trade = openFormat(result.filePaths[0], arg);
                //     this.newEditTrade(trade);
                // });
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      {
        type: 'separator'
      },
      {
        label: '保存',

        accelerator: 'ctrl+s',

        click: function() {
          dialog
            .showSaveDialog({
              title: '保存文件',
              defaultPath: '',
              filters: [{ name: 'Text', extensions: ['md'] }]
            })
            .then(result => {
              console.log(result)
              if (!result.canceled && result.filePath) {
                console.log(
                  BrowserWindow.getFocusedWindow().webContents.send('save-files', result.filePath)
                )
                // console.log(BrowserWindow.getFocusedWindow().webContents.send('img-files',result.filePaths[0]))
                // this.$emitNode("tradeMenu", "open", result.filePaths[0]);
                // //  监听主进程读完文件数据
                // this.$onNodeOnce("tradeMenuOpen", (event, arg) => {
                //     let trade = openFormat(result.filePaths[0], arg);
                //     this.newEditTrade(trade);
                // });
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      {
        label: '另存为',

        accelerator: 'shift+ctrl+s',

        click: function() {
          dialog
            .showSaveDialog({
              title: '保存文件',
              defaultPath: '',
              filters: [{ name: 'Text', extensions: ['md'] }]
            })
            .then(result => {
              console.log(result)
              if (!result.canceled && result.filePath) {
                console.log(
                  BrowserWindow.getFocusedWindow().webContents.send('save-files', result.filePath)
                )
                // console.log(BrowserWindow.getFocusedWindow().webContents.send('img-files',result.filePaths[0]))
                // this.$emitNode("tradeMenu", "open", result.filePaths[0]);
                // //  监听主进程读完文件数据
                // this.$onNodeOnce("tradeMenuOpen", (event, arg) => {
                //     let trade = openFormat(result.filePaths[0], arg);
                //     this.newEditTrade(trade);
                // });
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    ]
  },
  {
    label: '编辑',
    submenu: [
      {
        label: '剪切',
        role: 'cut'
      },
      {
        label: '全选',
        role: 'selectall'
      },
      {
        label: '复制',
        role: 'copy',
        click: () => {
          console.log('copyEvent')
          BrowserWindow.getFocusedWindow().webContents.send('copy-lines', result.filePath)
        }
      },
      {
        label: '粘贴',
        role: 'paste',
        click: () => {
          console.log('pasteEvent')
          BrowserWindow.getFocusedWindow().webContents.send('paste-lines', result.filePath)
        }
      }
    ]
  }
]
var m = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(m)
