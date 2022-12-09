var CommonUtils = {
    /**
        去除字符串左右空格
        @param {String}str 原字符串
        @return {String} 去除左右空格后的字符串
     */
    trimStr: function(str) {
        if (str === undefined || str === 'undefined') {
            return ''
        }
        if (typeof(str) == 'number') {
            str = str.toString()
        }
        return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'')
    },
    /**
        转换空
        @param {String}str 原数据
        @return {String} 新数据
     */
    turnNull: function(str) {
        if (str === undefined || str === null || str === 'undefined' || str === 'null') {
            return ''
        }
        return str
    },
    /**
        是否为空
        @param {String}a 字符穿
        @return {Boolean} 是否为空
     */
    isEmpty: function(a) {
        if (a === undefined || a === 'undefined' || a === null || a === 'null' || a === ''
		|| JSON.stringify(a) === '{}' || JSON.stringify(a) === '[]') {
            return true
        }
        return false
    },
    /**
        阻止事件冒泡
        @param
        @return
    */
    stopProp: function(){
        var e = window.event || arguments.callee.caller.arguments[0]
        if (e.stopPropagation) {
            e.stopPropagation()
        } else {
            e.cancelBubble = true
        }
    },
    /**
	    日期格式化
        @param {Date}time 时间
        @param {String}format 时间格式
        @return {String} 新格式时间
    */
    dateFormat: function(time, format){
        var t = new Date(time)
        var tf = function(i){
            return (i<10?'0':'')+i
        }
        return format.replace(/YYYY|MM|DD|hh|mm|ss|zz/g, function(a){
            switch(a){
                case 'YYYY':
                    return tf(t.getFullYear())
                    break
                case 'MM':
                    return tf(t.getMonth()+1)
                    break
                case 'DD':
                    return tf(t.getDate())
                    break
                case 'hh':
                    return tf(t.getHours())
                    break
                case 'mm':
                    return tf(t.getMinutes())
                    break
                case 'ss':
                    return tf(t.getSeconds())
                    break
                case 'zz':
                    return tf(t.getMilliseconds())
                    break
            }
        })
    },
    /**
        价格分转元
        @param {String}price 分
        @return {String} 元
    */
    priceTransition: function(price) {
        return parseInt(price)/100
    },
    /**
        价格分转元(保留2位小数)
        @param {String}price 分
        @return {String} 元
    */
    priceTransitionFlex: function(price) {
        return (parseInt(price)/100).toFixed(2)
    },
    /**
        获取浏览器类型
        @param
        @return {String} 浏览器类型
    */
    getBrowserType: function() {
        const u = window.navigator.userAgent
        if (u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
            return 'wechat'
        }
        if (!this.isEmpty(this.getCookie('app_uinfo'))) {
            return 'app'
        }
        return 'browser'
    },
    /**
        获取cookie参数
        @param {String}key 参数名
        @return {String} 参数值
    */
    getCookie: function(key) {
        const cookieArr = document.cookie.split(';')
        for (var i = 0; i < cookieArr.length; i++) {
            const arr = cookieArr[i].split('=')
            if (this.trimStr(arr[0]) === key){
                return arr[1]
            }
        }
        return ''
    },
    /**
        转换#链接
        @param {String}key #链接
        @return {String} %23链接
    */
    convert23: function(url) {
        if (url.indexOf('#') > -1) {
            return url.replace(new RegExp('#','g'),'%23')
        }
        return url
    },
    /**
        加载公共资源
        @param {Function}callback 回调函数
        @return
    */
    loadCommon: function(callback) {
        this.appendLink('/src/assets/css/common/Common.css')
        this.appendLink('/src/assets/css/common/Dialog.css')
        this.appendScript('/src/third/jquery/Jquery-2.1.1.min.js', callback)
        this.appendScript('/src/config/Index.js')
        this.appendScript('/src/utils/md5.js')
        this.appendScript('/src/utils/AjaxUtils.js')
        this.appendScript('/src/utils/DialogUtils.js')
    },
    /**
	    添加link资源
        @param {String}href 资源路径
        @return
    */
    appendLink: function(href) {
        var link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        document.head.appendChild(link)
    },
    /**
	    添加script样式资源
        @param {String}src 资源路径
        @param {Function}callback 回调函数
        @return
    */
    appendScript: function(src, callback) {
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = src
        script.onload = function() {
            if (typeof(callback) === 'function') {
                callback()
            }
        }
        document.body.appendChild(script)
    },
    /**
	    自动设置高度
        @param {String}divId div的id
        @param {String}width 参考宽度
        @param {String}height 参考高度
        @return
    */
    autoHeight: function(divId, width, height) {
        var radio = height/width
        $('#'+divId).height(radio*document.body.clientWidth)
    },
    /**
	    设置网页标题
        @param {String}title 标题
        @return
    */
    setHtmlTitle: function(title) {
        $('title').text(title)
    },
    /**
	    设置标题
        @param {String}title 标题
        @return
    */
    setTitle: function(title) {
        $('#title').text(title)
        this.setHtmlTitle(title)
    },
    /**
	    铺满屏幕高度
        @param {dom}dom 元素
        @return
    */
    fullScreenHeight(dom) {
        dom.style.minHeight = (window.innerHeight-1) + 'px'
    },
    /**
	    返回
        @param
        @return
    */
    goBack() {
        history.back(-1)
    },
    /**
	    获取版本号
        @param
        @return
    */
    getVersion: function() {
        var route = ''
        if (typeof(Router) == 'undefined') {
            route = parent.Router.getCurrRoute()
        } else {
            route = Router.getCurrRoute()
        }
        if (route === 'jialan') {
            return '20190118'
        } else if (route.indexOf('invite')>-1) {
            return '201901241002'
        }
        return '20181113'
    },
    /**
        图片剪切
        @param {Number} minshort 最短边(必须是三个值中最小的)
        @param {Number} width 宽
        @param {Number} height 高
        @return {String} 压缩链接
    */
    shearImg(minshort, width, height){
        return '?x-oss-process=image/resize,s_' + minshort + '/crop,w_' + width + ',h_' + height + ',g_center/sharpen,100'
    }
}