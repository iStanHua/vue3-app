
// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
// window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

// if (!window.indexedDB) {
//    window.alert("Your browser doesn't support a stable version of IndexedDB.")
// }

/**
 * IndexedDB
 * 1 打开数据库。
 * 2 在数据库中创建一个对象仓库（object store）。
 * 3 启动一个事务，并发送一个请求来执行一些数据库操作，像增加或提取数据等。
 * 4 通过监听正确类型的 DOM 事件以等待操作完成。
 * 5 在操作结果上进行一些操作（可以在 request 对象中找到）
 */
export default class StanDB {
  /**
   * StanDB
   * @param {String} name    数据库名
   * @param {String} version 数据库版本号
   */
  constructor(name, version) {
    this.name = name
    this.version = version || 1
    this.db = null
    this.request = null
  }

  /**
   * 连接数据库
   */
  connect() {
    const request = window.indexedDB.open(this.name, this.version)
    this.request = request

    // 打开或创建数据库成功
    request.onsuccess = () => {
      console.log('Database opened succesfully')
      this.db = request.result
    }

    request.onerror = () => {
      console.log('Database failed to open')
    }

    request.onupgradeneeded = (event) => {

    }
  }

  /**
   * 创建数据库表
   * @param {String} name            表名
   * @param {String|Object} options
   * @param {String} options.key
   */
  async createTable(name, options) {
    return new Promise((resolve, reject) => {
      this.request.onupgradeneeded = (event) => {
        if (!db.objectStoreNames.contains(name)) {
          let objectStore
          if (typeof options === 'string')
            objectStore = db.createObjectStore(name, { keyPath: options, autoIncrement: true })

          else if (typeof options === 'object') {
            if (!options.key) {
              reject({ code: -1, data: 'keyPath is Required' })
              return ''
            }

            objectStore = db.createObjectStore(name, { keyPath: options.key, autoIncrement: options.autoIncrement })

            this.tableName = name

            // 唯一索引
            if (options.autoIncrement)
              objectStore.createIndex(options.key, options.key, { unique: true })

            // 索引
            if (Array.isArray(options.index)) {
              options.index.forEach(i => {
                objectStore.createIndex(i.name, i.name, { unique: i.unique })
              })
            }
          }

          resolve(objectStore)
        }
        else {
          resolve(event)
        }
      }
    })
  }

  /**
   * 插入数据
   * @param {Object|Array} data 数据
   */
  async insert(data) {
    console.log(data)
    const db = this.request.result
    return new Promise((resolve, reject) => {
      const objectStore = db.transaction([this.tableName], 'readwrite').objectStore(this.tableName)
      if (typeof data === 'object') {
        objectStore.add(data)
      }
      else if (Array.isArray(data)) {
        data.forEach(item => {
          objectStore.add(item)
        })
      }

      objectStore.onsuccess = (event) => {
        resolve(event)
      }
      objectStore.onerror = (event) => {
        reject(event)
      }
    })
  }
}