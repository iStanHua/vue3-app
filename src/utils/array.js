/**
 * Duff装置
 * @param {Array}    values  数组
 * @param {Function} process 回调函数
 */
export function DuffPrompt(values, process) {
  let _len = values.length
  let iterations = Math.floor(_len / 8)
  let leftover = _len % 8
  let i = 0
  if (leftover > 0) {
    do {
      process(values[i++])
    } while (--leftover)
    i = 0
  }
  do {
    process(values[i++])
    process(values[i++])
    process(values[i++])
    process(values[i++])
    process(values[i++])
    process(values[i++])
    process(values[i++])
    process(values[i++])
  } while (--iterations)
  i = 0
}

/**
 * 排名序号
 * @param {Array}   objectArray          数组
 * @param {String}  objectArray[0].name  名称
 * @param {Number}  objectArray[0].value 值
 * @param {Boolean}  isSort         是否排序
 */
export function RankIndex(objectArray, isSort = true) {
  isSort && (objectArray = objectArray.sort((a, b) => b.value - a.value))
  let lastVal = ''
  let lastIndex = 0
  let repeatCount = 1
  return objectArray.map(v => {
    if (v.value === lastVal) {
      repeatCount++
    }
    else {
      lastIndex += repeatCount
      repeatCount = 1
    }
    lastVal = v.value
    return Object.assign({}, v, { rank: lastIndex })
  })
}

/**
 * 数组中每个元素出现的次数
 * @param {Array} values 数组
 */
export function RepeatCount(values) {
  if (Array.isArray(values)) {
    return values.reduce((o, n) => {
      o[n] ? o[n]++ : (o[n] = 1)
      return o
    }, {})
  }
  else {
    return values
  }
}


/**
 * 按属性对object分类
 * @param {Array} objectArray  数组
 * @param {String} property    属性
 */
export function ObjectGroupBy(objectArray, property) {
  if (!property) return objectArray
  return objectArray.reduce((oo, o) => {
    let val = o[property]
    !oo[val] && (oo[val] = [])
    oo[val].push(o)
    val = null
    return oo
  }, {})
}

/**
 * 数组去重
 * @param {Array} values 数组
 */
export function Unique(values) {
  if (Array.isArray(values)) {
    return values.reduce((a, b) => a.includes(b) ? a : [...a, b], [])
  }
  else {
    return values
  }
}

/**
 * 数组去重
 * @param {Array} values promise数组
 * @param {Any} input    输出
 */
export function RunPromiseInSequence(values, input) {
  return values.reduce((promiseChain, currentFunction) => promiseChain.then(currentFunction), Promise.resolve(input))
}

/**
 * 笛卡尔积
 * @param {Array} values 数组[[...],[...],...]
 */
export function Descartes(values) {
  if (values.length < 2) return values[0] || []
  return Array.prototype.reduce.call(values, (col, set) => {
    let res = []
    col.forEach(c => {
      set.forEach(s => {
        var t = [].concat(Array.isArray(c) ? c : [c])
        t.push(s)
        res.push(t)
        t = null
      })
    })
    return res
  })
}