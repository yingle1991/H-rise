<!-- @format -->

<template>
  <div class="index-page">
    <!-- <HeaderNav /> -->
    <div id="vditor" class="vditor" />
  </div>
</template>

<script>
import Vditor from 'vditor'
// import HeaderNav from './partials/HeaderNav'
import defaultText from '@config/default'
const { ipcRenderer, autoUpdater, clipboard } = require('electron')
const fs = require('fs')
// const dialog = require('electron').dialog;
// const { dialog } = require('electron').remote
export default {
  name: 'index-page',

  data() {
    return {
      // isLoading: true,
      isMobile: window.innerWidth <= 960,
      vditor: null
    }
  },

  created() {
    this.setDefaultText()
    let that = this
    ipcRenderer.on('img-files', function(event, arg) {
      console.log('laile?') // prints "pong"
      // 这里是传给渲染进程的数据
      fs.readFile(arg, 'utf8', (err, data) => {
        if (err) {
          console.log(data)
        } else {
          console.log('1' + data)
          that.vditor.setValue(data)
        }
      })
    })
    ipcRenderer.on('save-files', function(event, arg) {
      console.log('laile1?') // prints "pong"
      // 这里是传给渲染进程的数据
      console.log(that.vditor.getValue())
      fs.writeFileSync(arg, that.vditor.getValue())
    })
    ipcRenderer.on('copy-lines', function(event, arg) {
      // 这里是传给渲染进程的数据
      console.log(that.vditor.getSelection())

      var copyText = that.vditor.getSelection()
      clipboard.writeText(copyText)
    })
    ipcRenderer.on('paste-lines', function(event, arg) {
      // 这里是传给渲染进程的数据
      console.log(clipboard.readText())
      var copyText = clipboard.readText()
      that.vditor.insertValue(copyText)
    })
  },

  components: {
    // HeaderNav
  },

  mounted() {
    let self = this
    this.initVditor(self)
    // this.$nextTick(() => {
    //   this.isLoading = false
    // })
  },

  methods: {
    initVditor(self) {
      const that = this
      const options = {
        // width: this.isMobile ? '100%' : '80%',
        width: '100%',
        height: 'auto',
        tab: '\t',
        counter: '999999',
        typewriterMode: true,
        mode: 'sv',
        preview: {
          delay: 100,
          show: false,
          actions: []
        },
        toolbarConfig: {
          pin: true
        },
        counter: {
          enable: true
        },
        outline: true,
        upload: {
          max: 5 * 1024 * 1024,
          // linkToImgUrl: 'https://sm.ms/api/upload',
          handler(file) {
            let formData = new FormData()
            for (let i in file) {
              formData.append('smfile', file[i])
            }
            let request = new XMLHttpRequest()
            request.open('POST', 'https://sm.ms/api/upload')
            request.onload = that.onloadCallback
            request.send(formData)
          }
        }
        // // 工具栏配置具体看 vditor 使用指南
        // toolbar: [
        //   {
        //     name: "open_save",
        //     tip: "打开/保存",
        //     icon: 'save',
        //     toolbar: [
        //       {
        //         name: "open_md",
        //         icon: '打开MD',
        //         click() {
        //           ipcRenderer.send("did-finish-load", "zhang")
        //           // self.open_md()
        //         }
        //       },
        //       {
        //         name: "export_md",
        //         icon: '导出MD',
        //         click() {
        //           return self.save_md()
        //         }
        //       },
        //     ],
        //   },
        //   "|",
        //   "emoji",
        //   "headings",
        //   "bold",
        //   "italic",
        //   "strike",
        //   "link",
        //   "|",
        //   "edit-mode",
        //   {
        //     name: "more",
        //     toolbar: [
        //       {
        //         name: "about",
        //         icon: '关于',
        //         click() {
        //           self.show_about()
        //         }
        //       },
        //     ],
        //   }],
      }
      this.vditor = new Vditor('vditor', options)
      this.vditor.focus()
    },
    onloadCallback(oEvent) {
      const currentTarget = oEvent.currentTarget
      if (currentTarget.status !== 200) {
        return this.$message({
          type: 'error',
          message: currentTarget.status + ' ' + currentTarget.statusText
        })
      }
      let resp = JSON.parse(currentTarget.response)
      let imgMdStr = ''
      if (resp.code === 'invalid_source') {
        return this.$message({
          type: 'error',
          message: resp.message
        })
      }
      if (resp.code === 'image_repeated') {
        imgMdStr = `![](${resp.images})`
      } else if (resp.code === 'success' || resp.success) {
        imgMdStr = `![${resp.data.filename}](${resp.data.url})`
      }
      this.vditor.insertValue(imgMdStr)
    },
    setDefaultText() {
      const savedMdContent = localStorage.getItem('vditorvditor') || ''
      if (!savedMdContent.trim()) {
        localStorage.setItem('vditorvditor', defaultText)
      }
    },
    async open_md() {
      // const file_path = await dialog.open({
      //   filter: 'md',
      // })
      ipcRenderer.send('did-finish-load', 'zhang')
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
            BrowserWindow.getFocusedWindow().webContents.send('action', result.filePaths[0])
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
      // Notification.info(JSON.stringify(file_path))
      let result = await readTextFile(file_path)
      // Notification.info(JSON.stringify(result))
      this.vditor.setValue(result)
    },
    async save_md() {
      const file_path = await dialog.save({
        filter: 'md'
      })
      await writeFile({
        path: file_path,
        contents: this.vditor.getValue()
      })
    }
  }
}
</script>

<style lang="less">
@import './../assets/styles/style.less';

.index-page {
  width: 100%;
  height: 100%;
  background-color: @white;
  .flex-box-center(column);

  .vditor {
    position: absolute;
    // top: @header-height;
    top: 0;
    max-width: @max-body-width;
    width: 80%;
    height: calc(100vh - 100px);
    // margin: 20px auto;
    text-align: left;
  }

  .vditor-reset {
    font-size: 14px;
  }

  .vditor-textarea {
    font-size: 14px;
    height: 100% !important;
  }
}

@media (max-width: 960px) {
  .index-page {
    .vditor {
      height: calc(100vh - 60px);
      padding: auto 10px;
      margin: 0px auto;
    }
  }
}
</style>
