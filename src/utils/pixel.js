/**
 * 图片像素处理
 */
export default class Pixel {
  constructor(imageData) {
    this.imageData = imageData
  }

  /**
   * 灰度图
   * 取红、绿、蓝三个像素值的算术平均值，这实际上将图像转成了黑白形式。
   * 假定d[i]是像素数组中一个象素的红色值，则d[i+1]为绿色值，d[i+2]为蓝色值，d[i+3]就是alpha通道值。
   * 转成灰度的算法，就是将红、绿、蓝三个值相加后除以3，再将结果写回数组。
   * @param {Number} amount 量值(0-1)
   */
  grayscale(amount = 1) {
    let data = this.imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i + 1] = data[i + 2] = amount * (data[i] + data[i + 1] + data[i + 2]) / 3
    }
    return this
  }

  /**
   * 复古效果(棕褐色)
   * 则是将红、绿、蓝三个像素，分别取这三个值的某种加权平均值，使得图像有一种古旧的效果。
   * @param {Number} amount 量值(0-1)
   */
  sepia(amount = 1) {
    let data = this.imageData.data
    for (let i = 0; i < data.length; i += 4) {
      let r = amount * data[i]
      let g = amount * data[i + 1]
      let b = amount * data[i + 2]

      data[i] = r * 0.393 + g * 0.769 + b * 0.189
      data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168
      data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131
    }
    return this
  }

  /**
   * 亮度效果
   * 让图像变得更亮或更暗。算法将红色通道、绿色通道、蓝色通道，同时加上一个正值或负值。
   * @param {Number} amount 量值(0-100)
   */
  brightness(amount = 1) {
    let data = this.imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] + amount
      data[i + 1] = data[i + 1] + amount
      data[i + 2] = data[i + 2] + amount
    }
    return this
  }

  /**
   * 反转效果
   * 图片呈现一种色彩颠倒的效果。算法为红、绿、蓝通道都取各自的相反值（255-原值）。
   */
  invert() {
    let data = this.imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]
      data[i + 1] = 255 - data[i + 1]
      data[i + 2] = 255 - data[i + 2]
    }
    return this
  }

  /**
   * 红色蒙版效果
   * 让图像呈现一种偏红的效果。算法是将红色通道设为红、绿、蓝三个值的平均值，而将绿色通道和蓝色通道都设为0。
   */
  redMask() {
    let data = this.imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i + 1] = data[i + 2] = 0
    }
    return this
  }

  /**
   * 底片效果
   * 将 255 与像素点的 rgb 的差，作为当前值。
   */
  negative() {
    let data = this.imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]
      data[i + 1] = 255 - data[i + 1]
      data[i + 2] = 255 - data[i + 2]
    }
    return this
  }

  /**
   * 二值图效果
   * 确定一个色值，比较当前的 rgb 值，大于这个值显示黑色，否则显示白色。
   */
  binaryGraph() {
    let data = this.imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const gray = (r + g + b) / 3
      const binary = gray > 126 ? 255 : 0
      data[i] = binary
      data[i + 1] = binary
      data[i + 2] = binary
    }
    return this
  }

  /**
   * 高斯模糊
   * 高斯模糊是“模糊”算法中的一种，每个像素的值都是周围相邻像素值的加权平均。
   * 原始像素的值有最大的高斯分布值（有最大的权重），相邻像素随着距离原始像素越来越远，权重也越来越小。
   * @param {Number} radius 模糊半径
   */
  blur(radius = 5) {
    var pixes = this.imageData.data;
    var width = this.imageData.width;
    var height = this.imageData.height;
    var gaussMatrix = [],
      gaussSum = 0,
      x, y,
      r, g, b, a,
      i, j, k, len;

    var sigma = 5;

    a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    b = -1 / (2 * sigma * sigma);
    //生成高斯矩阵
    for (i = 0, x = -radius; x <= radius; x++, i++) {
      g = a * Math.exp(b * x * x);
      gaussMatrix[i] = g;
      gaussSum += g;

    }

    //归一化, 保证高斯矩阵的值在[0,1]之间
    for (i = 0, len = gaussMatrix.length; i < len; i++) {
      gaussMatrix[i] /= gaussSum;
    }
    //x 方向一维高斯运算
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        r = g = b = a = 0;
        gaussSum = 0;
        for (j = -radius; j <= radius; j++) {
          k = x + j;
          if (k >= 0 && k < width) {//确保 k 没超出 x 的范围
            //r,g,b,a 四个一组
            i = (y * width + k) * 4;
            r += pixes[i] * gaussMatrix[j + radius];
            g += pixes[i + 1] * gaussMatrix[j + radius];
            b += pixes[i + 2] * gaussMatrix[j + radius];
            // a += pixes[i + 3] * gaussMatrix[j];
            gaussSum += gaussMatrix[j + radius];
          }
        }
        i = (y * width + x) * 4;
        // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
        // console.log(gaussSum)
        pixes[i] = r / gaussSum;
        pixes[i + 1] = g / gaussSum;
        pixes[i + 2] = b / gaussSum;
        // pixes[i + 3] = a ;
      }
    }
    //y 方向一维高斯运算
    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        r = g = b = a = 0;
        gaussSum = 0;
        for (j = -radius; j <= radius; j++) {
          k = y + j;
          if (k >= 0 && k < height) {//确保 k 没超出 y 的范围
            i = (k * width + x) * 4;
            r += pixes[i] * gaussMatrix[j + radius];
            g += pixes[i + 1] * gaussMatrix[j + radius];
            b += pixes[i + 2] * gaussMatrix[j + radius];
            // a += pixes[i + 3] * gaussMatrix[j];
            gaussSum += gaussMatrix[j + radius];
          }
        }
        i = (y * width + x) * 4;
        pixes[i] = r / gaussSum;
        pixes[i + 1] = g / gaussSum;
        pixes[i + 2] = b / gaussSum;
      }
    }
    return this
  }

}