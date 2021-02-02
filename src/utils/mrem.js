(function (document, window) {
    let docEl = document.documentElement
    let _baseWidth = 750
    let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
    let _ios = navigator.userAgent.toLowerCase().match(/iphone|ipad|ipod/i)
    let _android = navigator.userAgent.toLowerCase().match(/android/i)
    if (_ios || _android) {
        docEl.classList.add('m-html')
        if (_ios) {
            docEl.classList.add('iosx' + window.devicePixelRatio)
        }
        let recalc = function () {
            let _clientWidth = docEl.clientWidth
            if (!_clientWidth) return
            if (_clientWidth >= _baseWidth) {
                _clientWidth = _baseWidth
            }
            docEl.style.fontSize = 200 * (_clientWidth / _baseWidth) + 'px'
        }
        recalc()
        if (document.addEventListener) {
            window.addEventListener(resizeEvt, recalc, false)
        }
    }
    else {
        docEl.style.fontSize = '100px'
    }
})(document, window)