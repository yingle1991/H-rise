/** @format */

import Vue from 'vue'
const $lodash = require('./lodash').default

if (typeof String.prototype.startsWith !== 'function') {
  Window.String.prototype.startsWith = function(prefix) {
    return this.slice(0, prefix.length) === prefix
  }
}

export default {
  resMsg(res) {
    let key = {
      zh: 'Chinese',
      en: 'English'
    }[Vue.config.lang]
    try {
      let obj = JSON.parse(res.Message)
      return obj[key] || obj.Chinese
    } catch (e) {
      return res && res.Message
    }
  },

  serverUrl(apiName) {
    return `app/${apiName}`
  },

  titleLang(zhStr, enStr) {
    return {
      zh: zhStr,
      en: enStr
    }
  },

  query(search) {
    let str = search || window.location.search
    let objURL = {}

    str.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), ($0, $1, $2, $3) => {
      objURL[$1] = $3
    })
    return objURL
  },

  queryString(url, query) {
    let str = []
    for (let key in query) {
      str.push(key + '=' + query[key])
    }
    let paramStr = str.join('&')
    return paramStr ? `${url}?${paramStr}` : url
  },

  assembleExternalLink(url) {
    const separator = $lodash.endsWith(url, '/') ? '' : '/'
    return `${url}${separator}?utm_source=markdown.lovejade.cn`
  },

  openAuthorSite(p) {
    window.open(`${this.assembleExternalLink('https://aboutme.lovejade.cn/')}&position=${p}`)
  },

  makeUpZero(num = 0) {
    return num < 10 ? `0${num}` : num
  },

  getTimestamp() {
    const date = new Date()
    const y = `${date.getFullYear()}`.replace('20', '')
    let mo = this.makeUpZero(date.getMonth() + 1)
    const d = this.makeUpZero(date.getDate())
    const h = this.makeUpZero(date.getHours())
    const m = this.makeUpZero(date.getMinutes())
    const s = this.makeUpZero(date.getSeconds())
    return `${y}${mo}${d}${h}${m}${s}`
  },

  getExportFileName() {
    const type = location.pathname.split('/')[0]
    const timestamp = this.getTimestamp()
    const filename = `rdtalk-${timestamp}.${type}`
    return filename
  },

  updateHtmlStyle() {
    const htmlNode = document.querySelector('html')
    htmlNode.style.overflow = 'auto'
    htmlNode.style.height = 'auto'
  },

  hideVditorTextarea() {
    const exportVditorNode = document.getElementById('khaleesi')
    const option = {
      childList: true, // ???????????????????????????????????????????????????
      attributes: true, // ???????????????
      characterData: true, // ????????????????????????????????????

      subtree: true, // ?????????????????????????????????????????????????????????
      attributeFilter: ['class', 'style'], // ??????????????????
      attributeOldValue: true, // ?????? attributes ???????????????????????????????????????????????????
      characterDataOldValue: true // ?????? characterData ??????????????????????????????????????????
    }
    const mutationObserver = new MutationObserver(() => {
      const vditorTextarea = document.getElementsByClassName('vditor-textarea')
      if (vditorTextarea && vditorTextarea[0]) {
        vditorTextarea[0].style.display = 'none'
        mutationObserver.disconnect()
      }
    })
    mutationObserver.observe(exportVditorNode, option)
  },

  /* -----------------------------localStorage------------------------------------ */
  /*
   * set localStorage
   */
  setStorage(name, content) {
    if (!name) return
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
  },

  /**
   * get localStorage
   */
  getStorage(name) {
    if (!name) return
    let content = window.localStorage.getItem(name)
    return JSON.parse(content)
  },

  /**
   * delete localStorage
   */
  removeStorage(name) {
    if (!name) return
    window.localStorage.removeItem(name)
  }
}
