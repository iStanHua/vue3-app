
export default class Camera {
  /**
   * 摄像头
   * @param {Number} options.width              宽度
   * @param {Number} options.height             高度
   * @param {Boolean} options.mirror            是否支持镜子
   * @param {Object} options.targetCanvas       canvas对象
   * @param {Number} options.fps                帧/秒
   *
   * @param {Function} options.onSuccess        成功回调处理
   * @param {Function} options.onError          错误回调处理
   * @param {Function} options.onNotSupported   不支持回调处理
   * @param {Function} options.onFrame          帧回调处理
   */
  constructor(options) {
    this.options = options || {}
    this.initVideo()
  }

  /**
   * 初始化Video
   */
  initVideo() {
    const options = this.options
    const video = document.createElement('video')
    this.video = video
    video.setAttribute('width', options.width)
    video.setAttribute('height', options.height)

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL

    if (navigator.getUserMedia) {
      navigator.getUserMedia({ video: true }, (stream) => {
        options.onSuccess()

        // hack for Firefox < 19
        if (video.mozSrcObject !== undefined) {
          video.mozSrcObject = stream
        } else {
          video.src = (window.URL && window.URL.createObjectURL(stream)) || stream
        }

        this.initCanvas()
      }, options.onError)
    } else {
      options.onNotSupported()
    }
  }

  /**
   * 初始化Canvas
   */
  initCanvas() {
    const options = this.options
    const canvas = options.targetCanvas || document.createElement('canvas')
    this.canvas = canvas
    canvas.setAttribute('width', options.width)
    canvas.setAttribute('height', options.height)

    context = canvas.getContext('2d')
    this.context = context

    // mirror video
    if (options.mirror) {
      context.translate(canvas.width, 0)
      context.scale(-1, 1)
    }

    this.startCapture()
  }

  /**
   * 开始捕获
   */
  startCapture() {
    this.video.play()

    this.renderTimer = setInterval(() => {
      try {
        this.context.drawImage(video, 0, 0, video.width, video.height)
        this.options.onFrame(canvas)
      } catch (e) {
        // TODO
      }
    }, Math.round(1000 / options.fps))
  }

  /**
   * 停止捕获
   */
  stopCapture() {
    this.pauseCapture()

    if (this.video.mozSrcObject !== undefined) this.video.mozSrcObject = null
    else this.video.src = ''
  }

  /**
   * 暂停捕获
   */
  pauseCapture() {
    if (this.renderTimer) clearInterval(this.renderTimer)
    this.video.pause()
  }
}
