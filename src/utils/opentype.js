
import opentype from 'opentype.js'

/**
 * opentype
 */
export default class Opentype {
  constructor() {

  }

  /**
   * 加载字体
   * @param {String} fontUrl 字体文件
   */
  load(fontUrl) {
    return new Promise((resolve, reject) => {
      opentype.load(fontUrl, (err, font) => {
        if (err) reject(err)
        resolve(font)

        this.font = font
        return this
      })
    })
  }

  /**
   * 加载字体文件流
   * @param {ArrayBuffer} buffer 字体文件流
   */
  parse(buffer) {
    this.font = opentype.parse(buffer)
    return this
  }


  /**
   * 获取宽度
   * @param {String} text                   字符串
   * @param {Number} options.fontSize       字体大小
   * @param {Boolean} options.kerning       字距调整
   * @param {Number} options.letterSpacing  字母间距
   * @param {Number} options.tracking       轨迹值
   */
  getWidth(text, options) {
    const fontSize = options.fontSize || 72
    const kerning = 'kerning' in options ? options.kerning : true
    const fontScale = 1 / this.font.unitsPerEm * fontSize

    let width = 0
    const glyphs = this.font.stringToGlyphs(text)
    for (let i = 0; i < glyphs.length; i++) {
      const glyph = glyphs[i]

      if (glyph.advanceWidth) {
        width += glyph.advanceWidth * fontScale
      }

      if (kerning && i < glyphs.length - 1) {
        const kerningValue = this.font.getKerningValue(glyph, glyphs[i + 1])
        width += kerningValue * fontScale
      }

      if (options.letterSpacing) {
        width += options.letterSpacing * fontSize
      } else if (options.tracking) {
        width += (options.tracking / 1000) * fontSize
      }
    }
    return width
  }

  /**
   * 获取高度
   * @param {Number} fontSize 字体大小
   */
  getHeight(fontSize) {
    const fontScale = 1 / this.font.unitsPerEm * fontSize
    return (this.font.ascender - this.font.descender) * fontScale
  }
}