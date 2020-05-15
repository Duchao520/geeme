import Vue from 'vue'

const Print = function (dom, title) {
  if (!(this instanceof Print)) return new Print(dom, title)
  this.options = {
    'notPrint': '.not-print'
  }
  this.dom = this.isDom(dom) ? dom : dom.$el
  this.title = title
  this.init()
}

Print.prototype = {
  isDom: function(obj) {
    return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
  },
  init: function() {
    let content = this.getStyle() + this.getHtml()
    this.writeIframe(content)
  },
  getStyle: function() {
    let str = ''
    let styles = document.querySelectorAll('style.link')
    for (let i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML
    }
    str += `<style>${this.options.notPrint} { display: none; }</style>`
    return str
  },
  getHtml: function() {
    let inputs = document.querySelectorAll('input')
    let textareas = document.querySelectorAll('textarea')
    let selects = document.querySelectorAll('select')
    let canvass = document.querySelectorAll('canvas')
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].type === 'input') {
        inputs[i].innerHTML = inputs[i].value
      }
    }
    for (let t = 0; t < textareas.length; t++) {
      if (textareas[t].type === 'textarea') {
        textareas[t].innerHTML = textareas[t].value
      }
    }
    for (let s = 0; s < selects.length; s++) {
      if (selects[s].type === 'select') {
        selects[s].innerHTML = selects[s].value
      }
    }
    for (let c = 0; c < canvass.length; c++) {
      let imageURL = canvass[c].toDataURL('image/png')
      let img = document.createElement('img')
      img.src = imageURL
      img.setAttribute('style', 'max-width: 100%;')
      img.className = 'isNeedRemove'
      canvass[c].parentNode.insertBefore(img, canvass[c].nextElementSibling)
    }
    return this.setHeader()
  },
  setHeader: function() {
    let dom = document.createElement('html')
    let title = document.createElement('title')
    let newDom = this.dom.cloneNode(true)
    title.innerHTML = this.title
    dom.appendChild(title)
    dom.appendChild(newDom)
    return dom.outerHTML
  },
  writeIframe: function(content) {
    let iframe = document.createElement('iframe')
    iframe.setAttribute('style', 'display: none;')
    let f = document.body.appendChild(iframe)
    let w = f.contentWindow || f.contentDocument
    let doc =  f.contentDocument || f.contentWindow.document
    doc.open()
    doc.write(content)
    doc.close()
    let removes = document.querySelectorAll('.isNeedRemove')
    for (let i = 0; i < removes.length; i++) {
      removes[i].parentNode.removeChild(removes[i])
    }
    this.toPrint(w, iframe)
  },
  toPrint: function(frameWindow, iframeDom) {
    try {
      setTimeout(function() {
        frameWindow.focus()
        try {
          if (!frameWindow.document.execCommand('print', false, null)) {
            frameWindow.print()
          }
        } catch(e) {
          frameWindow.print()
        }
        frameWindow.close()
        document.body.removeChild(iframeDom)
      }, 15);
    } catch(err) {
      console.log('error：', err)
    }
  },
}

const printPlugin = {}

printPlugin.install = function () {
  Vue.prototype.$print = Print
}

export default printPlugin
