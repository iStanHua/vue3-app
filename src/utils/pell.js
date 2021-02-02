/**
 * 富文本编辑器
 */
export default class Pell {
  /**
   *
   * @param {HTMLElement} options.el                   对象元素
   * @param {Boolean} options.styleWithCSS             是否支持style(<span style="font-weight: bold;"></span> instead of <b></b>)
   * @param {Array[string | Object]} options.actions   工具类
   * @param {String} options.actions.title             标题
   * @param {String} options.actions.icon              图标
   * @param {Function} options.actions.state           查看命令状态
   * @param {Function} options.actions.result          执行命令结果
   */
  constructor(options = {}) {
    options.styleWithCSS = options.styleWithCSS || false
    this.options = options

    this.render()
  }

  /**
   * 渲染
   * head: [
        {
          name: 'paragraph',
          title: '段落',
          result: () => this.exec(formatBlock, '<p>')
        },
        {
          name: 'heading1',
          title: '标题1',
          result: () => this.exec(formatBlock, '<h1>')
        },
        {
          name: 'heading2',
          title: '标题2',
          result: () => this.exec(formatBlock, '<h2>')
        },
        {
          name: 'heading3',
          title: '标题3',
          result: () => this.exec(formatBlock, '<h3>')
        }
      ],
   */
  render() {
    const options = this.options
    const formatBlock = 'formatBlock'
    const defaultActions = {
      bold: {
        icon: 'i-bold',
        title: '粗体',
        state: () => this.queryCommandState('bold'),
        result: () => this.exec('bold')
      },
      italic: {
        icon: 'i-italic',
        title: '斜体',
        state: () => this.queryCommandState('italic'),
        result: () => this.exec('italic')
      },
      underline: {
        icon: 'i-underline',
        title: '下划线',
        state: () => this.queryCommandState('underline'),
        result: () => this.exec('underline')
      },
      strikethrough: {
        icon: 'i-strike-through',
        title: '删除线',
        state: () => this.queryCommandState('strikeThrough'),
        result: () => this.exec('strikeThrough')
      },
      quote: {
        icon: 'i-quote',
        title: '块引用',
        result: () => this.exec(formatBlock, '<blockquote>')
      },

      olist: {
        icon: 'i-olist',
        title: '有序列表',
        result: () => this.exec('insertOrderedList')
      },
      ulist: {
        icon: 'i-ulist',
        title: '无序列表',
        result: () => this.exec('insertUnorderedList')
      },
      line: {
        icon: 'i-line',
        title: '水平分割线',
        result: () => this.exec('insertHorizontalRule')
      },
      code: {
        icon: 'i-code',
        title: '插入代码',
        result: () => this.exec(formatBlock, '<pre>')
      },
      link: {
        icon: 'i-link',
        title: '插入链接',
        result: () => {
          const url = window.prompt('Enter the link URL')
          if (url) this.exec('createLink', url)
        }
      },
      image: {
        icon: 'i-image',
        title: '插入图片',
        result: () => {
          const url = window.prompt('Enter the image URL')
          if (url) this.exec('insertImage', url)
        }
      }
    }
    let actions = []

    if (Array.isArray(options.actions)) {
      actions = options.actions.map(a => {
        if (typeof a === 'string') return defaultActions[a]
        else if (defaultActions[a.name]) return { ...defaultActions[a.name], ...a }
        return a
      })
    }
    else actions = Object.keys(defaultActions).map(a => defaultActions[a])

    // toolbar
    const $toolbar = this.createElement('div')
    $toolbar.className = 'pell-toolbar'
    this.appendChild(options.el, $toolbar)

    // content
    const $content = this.createElement('div')
    $content.className = 'pell-content'
    $content.contentEditable = true

    $content.oninput = ({ target: { firstChild } }) => {
      if (firstChild && firstChild.nodeType === 3) this.exec(formatBlock, `<p>`)
      else if ($content.innerHTML === '<br>') $content.innerHTML = ''
      options.onChange($content.innerHTML)
    }
    $content.onkeydown = (event) => {
      if (event.key === 'Enter' && this.queryCommandValue(formatBlock) === 'blockquote') {
        setTimeout(() => this.exec(formatBlock, `<p>`), 0)
      }
    }
    this.appendChild(options.el, $content)

    // actions
    actions.forEach(action => {
      const $button = this.createElement('a')
      $button.className = 'pell-btn'
      $button.title = action.title
      // $button.setAttribute('type', 'button')
      $button.setAttribute('aria-label', action.title)
      $button.setAttribute('tabindex', -1)
      $button.setAttribute('aria-disabled', false)
      $button.setAttribute('aria-pressed', false)

      $button.onclick = () => action.result() && $content.focus()

      if (action.state) {
        const onState = () => $button.classList[action.state() ? 'add' : 'remove']('pell-active')
        this.addEventListener($content, 'keyup', onState)
        this.addEventListener($content, 'mouseup', onState)
        this.addEventListener($button, 'click', onState)
      }

      const $i = this.createElement('i')
      $i.className = `pell-icon ${action.icon}`
      this.appendChild($button, $i)

      this.appendChild($toolbar, $button)
    })

    if (options.styleWithCSS) this.exec('styleWithCSS')
    this.exec('defaultParagraphSeparator', 'p')

    return options.element
  }

  /**
   * 监听事件
   * @param {HTMLElement} parent  父级元素
   * @param {String} type         事件名
   * @param {Function} listener   监听事件
   */
  addEventListener(parent, type, listener) {
    return parent.addEventListener(type, listener, false)
  }

  /**
   * 添加子级
   * @param {HTMLElement} parent  父级元素
   * @param {HTMLElement} child   子级元素
   */
  appendChild(parent, child) {
    return parent.appendChild(child)
  }

  /**
   * 创建标签
   * @param {String} tag  标签
   */
  createElement(tag) {
    return document.createElement(tag)
  }

  /**
   * 查看命令状态
   * @param {String} command 命令名
   */
  queryCommandState(command) {
    return document.queryCommandState(command)
  }

  /**
   * 查看命令值
   * @param {String} command 命令名
   */
  queryCommandValue(command) {
    return document.queryCommandValue(command)
  }

  /**
   * 执行命令
   * @param {String} command 命令名
   * @param {String} value   值
   */
  exec(command, value = null) {
    return document.execCommand(command, false, value)
  }
}