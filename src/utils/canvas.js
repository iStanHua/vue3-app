/**
 * canvas 画布
 * 绘制路径
 * 1.首先，你需要创建路径起始点(beginPath())
 * 2.然后你使用画图命令去画出路径()
 * 3.之后你把路径封闭(closePath())
 * 4.一旦路径生成，你就能通过描边或填充路径区域来渲染图形(stroke()，fill())
 */
export default class Canvas {
  /**
  * @param {String} canvasId  canvas唯一标识符
  * @param {String} type      指定canvas类型,默认值为2d
  * @param {Number} width     canvas的宽度
  * @param {Number} height    canvas的高度
  */
  constructor(canvasId, type = '2d', width, height) {
    if (typeof canvasId === 'string') {
      this.canvas = document.getElementById(canvasId)
    }
    else {
      throw new Error('canvas唯一标识符不能为空')
    }
    if (!type) {
      throw new Error('canvas类型不能为空')
    }
    this.ctx = this.canvas.getContext(type)

    width && (this.canvas.width = width)
    height && (this.canvas.height = height)
  }

  /**
   * 绘制圆弧路径的方法
   * 圆弧路径的圆心在 (x, y) 位置，半径为 r ，根据anticlockwise （默认为顺时针）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
   * @param {Number} x               圆弧中心（圆心）的 x 轴坐标
   * @param {Number} y               圆弧中心（圆心）的 y 轴坐标
   * @param {Number} radius          圆弧的半径
   * @param {Number} startAngle      圆弧的起始点， x轴方向开始计算，单位以弧度表示
   * @param {Number} endAngle        圆弧的终点， 单位以弧度表示
   * @param {Boolean} anticlockwise  如果为 true，逆时针绘制圆弧，反之，顺时针绘制
   */
  arc(x, y, radius, startAngle, endAngle, anticlockwise = false) {
    // 新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)
    // 通过线条来绘制图形轮廓
    this.ctx.stroke()
  }

  /**
   *
   * @param {String} image     所要绘制的图片
   * @param {Number} x         x轴坐标
   * @param {Number} y         y轴坐标
   * @param {Number} width     宽度
   * @param {Number} height    高度
   */
  drawImage(image, x, y, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, width, height)
    return canvas.toDataURL()
  }

  drawCircle(option) {
    const color_arr = option.color
    let data_arr = option.data
    const pi2 = Math.PI * 2;
    let startAgl = 0;
    let agl;
    let sum = 0;
    const cW = this.canvas.width;
    const cH = this.canvas.height;
    for (let item of data_arr) {
      sum += item.value * 1.0
    }
    data_arr = data_arr.map((v, i) => {
      return {
        name: v.name,
        value: (v.value) * 1.0 / sum
      }
    })
    for (let i = 0; i < data_arr.length; i++) {
      //绘制饼图
      let min = (cW > cH ? cH : cW); //获取canvas宽高的最小值
      agl = data_arr[i].value * pi2 + startAgl; //终点
      this.ctx.strokeStyle = color_arr[i];
      this.ctx.lineWidth = data_arr[i].value * min * 0.3; // 线的粗细
      this.ctx.beginPath();
      this.ctx.arc(cW / 2, cH / 2, min * 0.3, startAgl, agl, false); //画圆
      this.ctx.stroke();
      this.ctx.closePath();
      startAgl = agl;

      //绘制图例
      this.ctx.fillStyle = color_arr[i];
      this.ctx.fillRect(cW * 0.8, 50 + 18 * i, 16, 16);
      this.ctx.fillText(data_arr[i].name, cW * 0.8 + 20, 62 + 18 * i);
    }
  }

  // #region 绘制矩形

  /**
   * 清除画布
   * @param {Number} x         x轴坐标(必填)
   * @param {Number} y         y轴坐标(必填)
   * @param {Number} width     宽度(选填)
   * @param {Number} height    高度(选填)
   */
  clearRect(x, y, width, height) {
    width = width || this.canvas.width
    height = height || this.canvas.height
    this.ctx.clearRect(x, y, width, height)
  }

  /**
   * 填充矩形
   * @param {Number} x         x轴坐标(必填)
   * @param {Number} y         y轴坐标(必填)
   * @param {Number} width     宽度(选填)
   * @param {Number} height    高度(选填)
   */
  fillRect(x, y, width, height) {
    width = width || this.canvas.width
    height = height || this.canvas.height
    this.ctx.fillRect(x, y, width, height)
  }

  /**
   * 描边矩形
   * @param {Number} x         x轴坐标(必填)
   * @param {Number} y         y轴坐标(必填)
   * @param {Number} width     宽度 正值在右侧，负值在左侧(选填)
   * @param {Number} height    高度 正值在下，负值在上(选填)
   */
  strokeRect(x, y, width, height) {
    width = width || this.canvas.width
    height = height || this.canvas.height
    this.ctx.strokeRect(x, y, width, height)
  }

  // #endregion


  // #region 绘制文本

  /**
   * 填充文本
   * @param {String} text      宽度(必填)
   * @param {Number} x         x轴坐标(必填)
   * @param {Number} y         y轴坐标(必填)
   * @param {Number} maxWidth  最大宽度(选填)
   */
  fillText(text, x, y, maxWidth) {
    if (maxWidth) {
      this.ctx.fillText(text, x, y)
    }
    else {
      this.ctx.fillText(text, x, y, maxWidth)
    }
  }

  /**
   * 描边文本
   * @param {String} text      宽度(必填)
   * @param {Number} x         x轴坐标(必填)
   * @param {Number} y         y轴坐标(必填)
   * @param {Number} maxWidth  最大宽度(选填)
   */
  strokeText(text, x, y, maxWidth) {
    if (maxWidth) {
      this.ctx.strokeText(text, x, y)
    }
    else {
      this.ctx.strokeText(text, x, y, maxWidth)
    }
  }

  // #endregion
}