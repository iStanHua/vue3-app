/**
 * 飘落
 */
export default class Falling {
  constructor(imgSrc, num = 60) {
    if (!imgSrc) return

    const img = new Image()
    img.src = imgSrc
    img.onload = () => {
      this.start()
    }
    this.img = img

    this.num = num
    this.stopTimer = null
    // 是否开始
    this.isStart = false
  }
  /**
   * 开始
   */
  start() {
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame

    let canvas = document.createElement('canvas')
    let cxt
    this.isStart = true
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    canvas.setAttribute('style', 'position: fixed;left: 0;top: 0;pointer-events: none;')
    canvas.setAttribute('id', 'canvasFalling')
    document.getElementsByTagName('body')[0].appendChild(canvas)
    cxt = canvas.getContext('2d')

    const fallPictureList = new FallPictureList()
    const num = this.num
    // 设置个数
    for (let i = 0; i < num; i++) {
      let randomX = getRandom('x')
      let randomY = getRandom('y')
      let randomS = getRandom('r')
      let randomR = getRandom('s')
      let randomFnx = getRandom('fnx')
      let randomFny = getRandom('fny')
      let randomFnR = getRandom('fnr')
      let fallPicture = new FallPicture(randomX, randomY, randomS, randomR, { x: randomFnx, y: randomFny, r: randomFnR }, i, num, this.img)
      fallPicture.draw(cxt)
      fallPictureList.push(fallPicture)
    }

    this.stopTimer = requestAnimationFrame(failDraw)

    function failDraw() {
      cxt.clearRect(0, 0, canvas.width, canvas.height)
      // 修改飘落图片位置逻辑
      fallPictureList.update()
      // 画出修改后的飘落图片
      fallPictureList.draw(cxt)

      // 递归 修改位置, 画出修改后的飘落图片
      requestAnimationFrame(failDraw)
    }
  }
  /**
   * 停止
   */
  stop() {
    if (this.isStart) {
      window.cancelAnimationFrame(this.stopTimer)
      this.isStart = false
    } else {
      this.start()
    }
  }

  destroyed() {
    this.stop()
    let child = document.getElementById('canvasFalling')
    child.parentNode.removeChild(child)
  }
}

/**
 * 飘落图片
 */
class FallPicture {
  constructor(x, y, s, r, fn, idx, num = 60, img) {
    this.x = x
    this.y = y
    this.s = s
    this.r = r
    this.fn = fn
    this.idx = idx

    this.img = img

    // 越界限制次数, -1不做限制,无限循环
    let limitTimes = -1

    // 定义限制数组
    let limitArray = new Array(num)
    for (let i = 0; i < num; i++) {
      limitArray[i] = limitTimes
    }

    this.limitArray = limitArray
  }

  /**
   * 绘制
   * @param {Object} cxt
   */
  draw(cxt) {
    cxt.save()
    var xc = 40 * this.s / 4
    cxt.translate(this.x, this.y)
    cxt.rotate(this.r)
    cxt.drawImage(this.img, 0, 0, 40 * this.s, 40 * this.s)
    cxt.restore()
  }

  /**
   * 更新
   */
  update() {
    this.x = this.fn.x(this.x, this.y)
    this.y = this.fn.y(this.y, this.y)
    this.r = this.fn.r(this.r)

    // 如果飘落图片越界, 重新调整位置
    if (this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0) {
      // 如果飘落图片不做限制
      if (this.limitArray[this.idx] == -1) {
        this.r = getRandom('fnr')
        if (Math.random() > 0.4) {
          this.x = getRandom('x')
          this.y = 0
          this.s = getRandom('s')
          this.r = getRandom('r')
        } else {
          this.x = window.innerWidth
          this.y = getRandom('y')
          this.s = getRandom('s')
          this.r = getRandom('r')
        }
      }
      // 否则飘落图片有限制
      else {
        if (this.limitArray[this.idx] > 0) {
          this.r = getRandom('fnr')
          if (Math.random() > 0.4) {
            this.x = getRandom('x')
            this.y = 0
            this.s = getRandom('s')
            this.r = getRandom('r')
          } else {
            this.x = window.innerWidth
            this.y = getRandom('y')
            this.s = getRandom('s')
            this.r = getRandom('r')
          }
          this.limitArray[this.idx]--
        }
      }
    }
  }
}

/**
 * 获取随机值
 * @param {String} option
 */
function getRandom(option) {
  let ret
  let random
  switch (option) {
    case 'x':
      ret = Math.random() * window.innerWidth
      break
    case 'y':
      ret = Math.random() * window.innerHeight
      break
    case 's':
      ret = Math.random()
      break
    case 'r':
      ret = Math.random() * 6
      break
    case 'fnx':
      random = -0.5 + Math.random() * 1
      ret = function (x, y) {
        return x + 0.5 * random - 1.7
      }
      break;
    case 'fny':
      random = 1.5 + Math.random() * 0.7
      ret = function (x, y) {
        return y + random;
      }
      break
    case 'fnr':
      random = Math.random() * 0.03
      ret = function (r) {
        return r + random;
      }
      break
  }
  return ret
}

/**
 * 飘落图片列表
 */
class FallPictureList {
  constructor() {
    this.list = []
  }

  /**
   * 添加
   * @param {Object} fallPicture
   */
  push(fallPicture) {
    this.list.push(fallPicture)
  }

  /**
   * 更新
   */
  update() {
    for (let i = 0, len = this.list.length; i < len; i++) {
      this.list[i].update()
    }
  }

  /**
   * 绘制
   * @param {Object} cxt
   */
  draw(cxt) {
    for (var i = 0, len = this.list.length; i < len; i++) {
      this.list[i].draw(cxt)
    }
  }
  /**
   * 获取
   * @param {Number} i
   */
  get(i) {
    return this.list[i]
  }

  /**
   * 大小
   */
  size() {
    return this.list.length
  }
}