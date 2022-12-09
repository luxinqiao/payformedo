var payType = ''
var price = Router.getParameter('rv_price')
var browserType = CommonUtils.getBrowserType()

$(function() {
    initParam()
    initPage()
})

/**
    初始化页面
    @param
    @return
*/
function initParam() {
    //使用';'分割参数(微信浏览器支付redirect_url会过滤掉'&')
    const successUrl = '?rv_param=rv_type:project'
    +';rv_name:'+decodeURI(Router.getParameter('rv_name'))
    +';rv_service_type:'+Router.getParameter('rv_service_type')
    +';rv_price:'+price
    +';rv_token:'+Router.getParameter('rv_token')
    localStorage.rv_successParam = successUrl
    localStorage.rv_token = Router.getParameter('rv_token')
}

/**
    初始化页面
    @param
    @return
*/
function initPage() {
    $('#main').addClass(browserType)
    $('#info').show()
    if (price != '0') {
        $('#price').text('￥'+CommonUtils.priceTransition(price)).show()
        $('#payType').show()
        $('#pay').children('button').text('去支付')
        CommonUtils.setTitle('确认支付')
    } else {
        $('#price').hide()
        $('#payType').hide()
        $('#pay').children('button').text('确认订单')
        CommonUtils.setTitle('确认订单')
    }
    $('#projectName').text(decodeURI(Router.getParameter('rv_name')))
    $('#serviceType').text(getAppointType(Router.getParameter('rv_service_type')))
    if (browserType == 'browser') {
        $('#alipay').show()
    } else if (browserType == 'wetchat') {
        $('#alipay').hide()
    }
    refreshPayBtn()
}

/**
    去支付
    @param
    @return
*/
function pay() {
    if (!isPay()) {
        return
    }
    rv_common.pay({
        token: localStorage.rv_token,
        pay_method: payType,
        product_code: Router.getParameter('rv_code'),
        product_count: '1',
        product_type: Dict_Product.RECOVERY_PRODUCT
    })
}