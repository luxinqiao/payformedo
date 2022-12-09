//路由构造函数
function Router() {
    this.routes = []
}
//路由原型添加
Router.prototype = {
    /**
        添加路由
        @param {Object}param 配置
        @return
    */
    addRoute: function(param) {
        if (typeof(param.children) === 'object' && param.children.length > 0) {
            for (var i=0; i<param.children.length; i++) {
                this.routes.push({
                    type: param.type,
                    route: param.route+'/'+param.children[i].route,
                    path: param.children[i].url
                })
            }
        } else {
            this.routes.push({
                type: param.type,
                route: param.route,
                path: param.url
            })
        }
    },
    /**
        路由初始化
        @param
        @return
    */
    init: function() {
        window.addEventListener('load', this.load.bind(this))
        window.addEventListener('hashchange', this.hashchange.bind(this))
    },
    /**
        页面加载
        @param
        @return
    */
    load: function() {
        var obj = this.getRoute(this.getCurrRoute())
        if (typeof(obj.path) === 'undefined') {
            this.jump('error/404')
            return
        } else {
            $('#rootPage').load(this.getPath(obj))
        }
    },
    /**
        创建iframe
        @param {String}src 路径
        @param {String}from 原路由
        @param {String}to 新路由
        @return
    */
    createIframe: function(src, from, to) {
        var $iframe = $('<iframe></iframe>').attr({
            src: src,
            from: from,
            to: to
        })
        $('#rootPage').append($iframe)
    },
    /**
        获取链接
        @param {Object}obj 路由
        @return {String} 链接
    */
    getPath: function(obj) {
        var rootPath = obj.route.indexOf('error') === 0 ? page_root.error : page_root.app
        return rootPath + obj.path
    },
    /**
        跳转连接
        @param {String}route 路由
        @return
    */
    jump: function(route) {
        var obj = this.getRoute(route)
        if (typeof(obj.path) === 'undefined') {
            this.jump('error/404')
            return
        } else {
            this.createIframe(this.getPath(obj), this.getCurrRoute(), route)
            var url = window.location.origin + '/#/' + route
            window.location.href = url
        }
    },
    /**
        hash路由变化
        @param
        @return
    */
    hashchange: function() {
        var obj = this.getRoute(this.getCurrRoute())
        $('#rootPage').load(this.getPath(obj))
    },
    /**
        获取当前路由
        @param
        @return {String} 当前路由
    */
    getCurrRoute: function() {
        var h = window.location.hash.substr(1)
        var i = h.indexOf('?')<0 ? h.length : h.indexOf('?')
        return h.substring(1, i)
    },
    /**
        获取路由对象
        @param {String}route 路由
        @return {Object} 路由对象
    */
    getRoute: function(route) {
        for (var i=0; i<this.routes.length; i++) {
            if (route === this.routes[i].route) {
                return this.routes[i]
            }
        }
        return {}
    },
    /**
        获取参数链接
        @param
        @return {String} 参数集
    */
    getSearch: function() {
        var h = window.location.hash.substr(1)
        var i = h.indexOf('?')<0 ? h.length : h.indexOf('?')
        return h.substr(i+1)
    },
    /**
        获取链接参数
        @param {String}param 参数名
        @return {String} 参数值
    */
    getParameter: function(param) {
        var reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)', 'i')
        var r = this.getSearch().match(reg)
        if (r != null) {
            return decodeURI(r[2])
        } else {
            return ''
        }
    }
}
//全局挂载Router
window.Router = new Router()
window.Router.init()