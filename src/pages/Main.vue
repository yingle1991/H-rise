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
const { ipcRenderer, autoUpdater, clipboard, dialog } = require('electron')
const fs = require('fs')
// const dialog = require('electron').dialog;
// const { dialog } = require('electron').remote
export default {
  name: 'index-page',

  data() {
    return {
      // isLoading: true,
      isMobile: window.innerWidth <= 960,
      vditor: null,
      openfilePath: null,
    }
  },

  created() {
    this.setDefaultText()
    let that = this
    ipcRenderer.on('img-files', function (event, arg) {
      that.openfilePath = arg;
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
    ipcRenderer.on('save-files', function (event, arg) {
      // 这里是传给渲染进程的数据
      if (!arg && !that.openfilePath) {
        ipcRenderer.send('show-save-dialog');
      } else {
        var filePath = arg ? arg : that.openfilePath;
        fs.writeFileSync(filePath, that.vditor.getValue())
      }
    })
    ipcRenderer.on('copy-lines', function (event) {
      // 这里是传给渲染进程的数据
      console.log(that.vditor.getSelection())
      var copyText = that.vditor.getSelection()
      clipboard.writeText(copyText)
    })
    ipcRenderer.on('paste-lines', function (event) {
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
      self=this;
      const that = this
      const options = {
        // width: this.isMobile ? '100%' : '80%',
        width: '100%',
        height: '100%',
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
        outline: {
          enable: true,
          position: 'left'
        },
        upload: {
          max: 5 * 1024 * 1024,
          // linkToImgUrl: 'https://sm.ms/api/upload',
          handler(file) {
            let formData = new FormData()
            for (let i in file) {
              formData.append('file', file[i])
              formData.append('uid', '787672c90139802e97db58d3a9f71e35')
              formData.append('token', '6b738b76c3f8ec2c8dbce31fedb32445')
            }
            let request = new XMLHttpRequest()
            request.open('POST', 'https://www.imgurl.org/api/v2/upload')
            request.onload = that.onloadCallback
            request.send(formData)
            // for (let i in file) {
            //   formData.append('smfile', file[i])
            // }
            // let request = new XMLHttpRequest()
            // request.open('POST', 'https://sm.ms/api/upload')
            // request.onload = that.onloadCallback
            // request.send(formData)
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
      // this.vditor.focus()
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
      //支持 imgurl
      if (resp.code === 200) {
        imgMdStr = `![${resp.data.client_name}](${resp.data.url})`
      }
      this.vditor.insertValue(imgMdStr)
    },
    setDefaultText() {
      const savedMdContent = localStorage.getItem('vditorvditor') || ''
      if (!savedMdContent.trim()) {
        localStorage.setItem('vditorvditor', defaultText)
      }
    },
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
