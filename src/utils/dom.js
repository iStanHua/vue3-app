// utils/dom.js

import { saveAs } from 'file-saver'

/**
 * 绑定事件
 * @param {Object} el      Element对象
 * @param {String} event   事件名称
 * @param {Function} fn    回调函数
 */
export function on(el, event, fn) {
  if (el.addEventListener) {
    el.addEventListener(event, fn, false)
  } else if (el.attachEvent) {
    el.attachEvent('on' + event, fn)
  } else {
    el['on' + event] = fn
  }
}

/**
 * 解除事件
 * @param {Object} el      Element对象
 * @param {String} event   事件名称
 * @param {Function} fn    回调函数
 */
export function off(el, event, fn) {
  if (el.removeEventListener) {
    el.removeEventListener(event, fn, false)
  } else if (ele.detachEvent) {
    el.detachEvent('on' + event, fn)
  } else {
    el['on' + event] = null
  }
}

/**
 * 解除一次事件
 * @param {Object} el      Element对象
 * @param {String} event   事件名称
 * @param {Function} fn    回调函数
 */
export function once(el, event, fn) {
  let listener = function () {
    if (fn) fn.apply(this, arguments)
    off(el, event, listener)
  }
  on(el, event, listener)
}

/**
 * 是否是Element对象
 * @param {HTMLElement} el  Element对象
 */
export function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE
}


/**
 * 获取元素的大小及其相对于视口的位置
 * @param {HTMLElement} el  Element对象
 */
export function getBoundingClientRect(el) {
  const rect = el.getBoundingClientRect()
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    x: rect.left,
    y: rect.top
  };
}

/**
 * 获取窗口滚动
 */
export function getWindowScroll() {
  const supportPageOffset = window.pageXOffset !== undefined
  const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat')
  let x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft
  let y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop

  return { x, y }
}

/**
 * 获取元素滚动位置
 * @param {HTMLElement} el  Element对象
 */
export function getElementScroll(el) {
  return { x: el.scrollLeft, y: el.scrollTop }
}

/**
 * 获取元素的所有CSS属性
 * @param {HTMLElement} el     Element对象
 * @param {String} pseudoElt   伪元素的字符串
 */
export function getComputedStyle(el, pseudoElt = null) {
  return document.defaultView.getComputedStyle(el, pseudoElt)
}

/**
 * 获取相关CSS属性
 * @param {HTMLElement} el  Element对象
 * @param {String} key     CSS属性值
 */
export function attr(el, key) {
  return el.currentStyle ? el.currentStyle[key] : getComputedStyle(el)[key]
}

/**
 * 父级是否出现滚动属性
 * @param {HTMLElement} el  Element对象
 */
export function isScrollParent(el) {
  // Firefox wants us to check `-x` and `-y` variations as well
  let _getComputedStyle = getComputedStyle(el)
  let overflow = _getComputedStyle.overflow
  let overflowX = _getComputedStyle.overflowX
  let overflowY = _getComputedStyle.overflowY

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX)
}


/**
 * 是否存在class名称
 * @param {Object} el    Element对象
 * @param {string} cls   class名称
 */
export function hasClass(el, cls) {
  if (el.classList) {
    return el.classList.contains(cls)
  }
  else {
    cls = cls || ''
    if (cls.replace(/\s/g, '').length == 0) return false
    return new RegExp(' ' + cls + ' ').test(' ' + el.className + ' ')
  }
}

/**
 * 添加class名称
 * @param {Object} el    Element对象
 * @param {string} cls   class名称
 */
export function addClass(el, cls) {
  if (!hasClass(el, cls)) {
    if (el.classList) {
      el.classList.add(cls)
    }
    else {
      let clsName = el.className
      el.className = clsName == '' ? cls : clsName + ' ' + cls
    }
  }
}

/**
 * 移除class名称
 * @param {Object} el    Element对象
 * @param {string} cls   class名称
 */
export function removeClass(el, cls) {
  if (hasClass(el, cls)) {
    if (el.classList) {
      el.classList.remove(cls)
    }
    else {
      let clsName = ' ' + el.className.replace(/[\t\r\n]/g, '') + ' '
      while (clsName.indexOf(' ' + cls + ' ') > -1) {
        clsName = clsName.replace(' ' + cls + ' ', ' ')
      }
      el.className = clsName.replace(/^\s+|\s+$/g, '')
    }
  }
}

/**
 * 图片转canvas
 * @param {String} url  图片url
 */
export function Image2Canvas(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function () {
      let canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      // 将img中的内容画到画布上
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)

      resolve(canvas)
    }
    img.onerror = (err) => {
      reject(err)
    }
    img.src = url
    // 必须设置，否则canvas中的内容无法转换为base64
    img.setAttribute('crossOrigin', 'Anonymous')
  })
}

/**
 * 下载图片
 * @param {String} url          图片url
 * @param {String} downloadName 名称
 */
export function DownloadImage(url, downloadName = `${Date.now()}.png`) {
  Image2Canvas(url).then(canvas => {
    saveAs(canvas.toDataURL(), downloadName)
  })
}