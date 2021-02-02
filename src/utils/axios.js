import axios from 'axios'
import store from '@/vuex/store'
import router from '@/router'

// 过滤不超时接口
const filterTimeouts = [

]


// http request 拦截器
axios.interceptors.request.use(
  config => {
    // 不超时接口
    if (filterTimeouts.indexOf(config.url) > -1) config.timeout = 0

    let _token = store.getters.userInfo.token
    if (_token) {
      config.headers.common['authorization'] = _token
    }
    config.withCredentials = true
    return config
  }, function (error) {
    return Promise.reject(error)
  }
)
// http response 拦截器
axios.interceptors.response.use(function (response) {
  if (response.data.code === 200) {
    return response.data
  }
  // token 已过期，重定向到登录页面
  else if (response.data.code == 401) {
    store.dispatch('logout')
    // router.replace({
    //     path: '/login',
    //     query: { redirect: router.currentRoute.fullPath }
    // })
    router.replace('/login')
  }
  else {
    console.log('系统异常，请重试')
  }
  return response
}, function (error) {
  return Promise.reject(error)
})

/**
 * 请求
 * @param {String} url    地址
 * @param {String} type   类型
 * @param {Object} data   数据
 */
export const fetch = (url, type, data) => {
  let _options = {
    method: type ? type.toLowerCase() : 'get',
    url: url
  }
  if (type === 'get') {
    _options.params = data
  }
  else if (type === 'post') {
    _options.data = data
  }

  return axios(_options).catch(err => {
    // 处理请求超时
    if (!err.response && err.message && err.message.indexOf('timeout of') > -1) {
      setTimeout(() => {
        fetch(url, type, data)
      }, 3000)
    }
  })
}

export function requestGet(url) {
  let request = null
  return new Promise((resolve, reject) => {
    request = new XMLHttpRequest()
    request.onreadystatechange = () => {
      if (request._canceled) { return }

      if (request.readyState === 4) {
        if ((request.status >= 200 && request.status < 300) || request.status === 1223) {
          resolve(request.responseText)
        } else {
          reject(request.responseText)
        }
        request.onreadystatechange = () => { }
      }
    };

    request.open('GET', url, true)
    request.responseType = ''

    request.send(null)
  }, function () {
    request._canceled = true
    request.abort()
  })
}