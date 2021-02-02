import { throttle, debounce } from '@/utils/index'

export default class ScrollNav {
  /**
   * 滚动导航
   * @param {HTMLElement|String} options.el     内容区(默认为document.body)
   * @param {String} options.section            内容块(默认为nav-section)
   * @param {Number} options.offset             误差值
   *
   * @param {Function} options.onScroll         Scroll事件回调处理
   */
  constructor(options) {
    options = Object.assign(options || {})
    typeof options.el === 'string' && (options.el = document.querySelector(options.el))
    this.$scrollEl = options.el ? options.el : window

    options.el = options.el || document.body
    options.section = options.section || 'section'
    options.offset = options.offset || 0

    this.options = options

    this.init()
  }

  /** 初始化 */
  init() {
    this.setSectionList()

    this.onScroll = throttle(this.onScroll, 100)
    this.onResize = debounce(this.onResize, 380)

    this.$scrollEl.addEventListener('scroll', () => { this.onScroll() }, false)
    window.addEventListener('resize', () => { this.onResize() }, false)
  }

  /** Scroll事件 */
  onScroll() {
    let _this = this
    let scrollTop = _this.getScrollTop()
    let index = 0
    scrollTop = scrollTop + _this.options.offset
    for (let i = 0; i < _this.sectionList.length; i++) {
      let o = _this.sectionList[i]
      if (scrollTop > o.top && scrollTop < o.end) {
        index = i
        break
      }
    }
    console.log(this.sectionList)

    typeof _this.options.onScroll === 'function' && (_this.options.onScroll(index, scrollTop))
  }

  /** Resize事件 */
  onResize() {
    this.setSectionList()
    this.onScroll()
  }

  /** 获取Sections的top,end值 */
  setSectionList() {
    let options = this.options
    let list = options.el.querySelectorAll(`.${options.section}`)
    // top列表
    let sectionList = []
    for (let i = 0; i < list.length; i++) {
      const rect = list[i].getBoundingClientRect()
      sectionList.push({
        top: rect.top,
        end: rect.top + rect.height
      })
    }
    this.sectionList = sectionList
  }

  /**
   * 滑动指定内容块
   * @param {Number} index 内容块索引
   */
  scrollTo(index) {
    let _this = this
    let sectionList = _this.sectionList
    if (!sectionList.length) return
    if (index > sectionList.length) return

    let scrollTop = _this.sectionList[index].top

    if (_this.$scrollEl.scrollTo) {
      if (_this.$scrollEl !== window) _this.$scrollEl.scrollTo({ top: scrollTop, behavior: 'smooth' })
      else {
        window.scrollTo({ top: scrollTop, behavior: 'smooth' })
      }
    }
    else {
      if (_this.$scrollEl !== window) _this.$scrollEl.scrollTop = scrollTop
      else {
        document.body.scrollTop = scrollTop
        document.documentElement.scrollTop = scrollTop
      }
    }
  }

  /***
   * 获取scrollTop
   * */
  getScrollTop() {
    if (this.$scrollEl !== window) return this.$scrollEl.scrollTop
    return document.body.scrollTop || document.documentElement.scrollTop
  }

  /** 消毁 */
  destroyed() {
    this.$scrollEl.removeEventListener('scroll', () => { this.onScroll() }, false)
    window.removeEventListener('resize', () => { this.onResize() }, false)
  }
}
