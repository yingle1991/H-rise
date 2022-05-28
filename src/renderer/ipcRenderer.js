//引入ipcRenderer模块，remote模块
var { ipcRenderer, remote } = require('electron')
const ipcMain = require('electron').ipcMain
//引入fs模块
var fs = require('fs')
//获取文本框的dom
// var textAreaDom = document.querySelector('#textArea')

ipcMain.on('action', function(event, action) {
  console.log('lege')
  // 通过dialog打开文件
  remote.dialog
    .showOpenDialog({
      properties: ['openFile']
    })
    .then(dir => {
      //通过fs模块读取文件内容
      var fsData = fs.readFileSync(dir.filePaths[0])
      //将fs模块中读取的内容渲染到文本输入框
      textAreaDom.value = fsData
    })
})
