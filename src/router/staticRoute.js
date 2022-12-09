//系统路由
Router.addRoute({
    route: 'error',
    children: [{
        route: '404',
        url: '404.html'
    }]
})
//上门产康
Router.addRoute({
    route: 'recovery',
    children: [{
        route: 'check',
        url: 'recovery/check.html'
    }, {
        route: 'project',
        url: 'recovery/project.html'
    }, {
        route: 'service',
        url: 'recovery/service.html'
    }]
})
//H5商城
Router.addRoute({
    route: 'mall',
    children: [{
        route: 'check',
        url: 'mall/check.html'
    }, {
        route: 'product',
        url: 'mall/product.html'
    }]
})
//极致学院
Router.addRoute({
    route: 'college',
    children: [{
        route: 'check',
        url: 'college/check.html'
    }, {
        route: 'product',
        url: 'college/product.html'
    }, {
        route: 'coupon',
        url: 'college/coupon.html'
    }]
})