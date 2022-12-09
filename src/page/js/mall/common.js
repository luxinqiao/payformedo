/**
 * 文件描述：支付页
 * 创建人：赵志银
 * 创建时间：2019-03-14
*/

//支付类型
const Dict_pay = {
    ALI: '0', //支付宝支付
    WECHAT: '1', //微信支付
    //2 - 银联、3 - Apple Pay、4 - 免费支付、5 - 余额
    FREEPAY: '4',   //免费支付
    BILLOWS: '5'  //余额
}
//项目类型
const Dict_Product = {
    //1 - 考试、2 - 课程、3 - 专栏、4 - 会议门票、5 - 会议讲义、6 - 评估、7 - 余额 、8 - 方案、9 - 定制方案、10 - 会议视频、11 - 直播 12-澜渟设备 13-上门产康-项目 14-上门产康-服务
    MALL_PRODUCT: '12' //澜渟设备
}

/**
    设置选中
    @param {String}type 类型
    @return
*/
function setCheck(type) {
    payType = type
    if (type === Dict_pay.WECHAT) {
        $('#wechatpay').children('.check').attr('src', '/src/assets/img/common/check.png')
        $('#alipay').children('.check').attr('src', '/src/assets/img/common/uncheck.png')
    } else if (type === Dict_pay.ALI) {
        $('#wechatpay').children('.check').attr('src', '/src/assets/img/common/uncheck.png')
        $('#alipay').children('.check').attr('src', '/src/assets/img/common/check.png')
    }
    refreshPayBtn()
}
/**
    设置选中余额
    @param 
    @return
*/
function gCheck(){
    if ($('#goldCheck').attr('src') == '/src/assets/img/common/yes.png') {
        $('#goldCheck').attr('src', '/src/assets/img/common/no.png')
        if(($('#alipay').children('.check').attr('src') != '/src/assets/img/common/check.png' )&&($('#wechatpay').children('.check').attr('src') != '/src/assets/img/common/check.png')) {
            $('#pay').children('button').removeClass('active')
        }
        if($('#alipay').children('.check').attr('src') == '/src/assets/img/common/check.png') {
            payType = Dict_pay.ALI
        }else if($('#wechatpay').children('.check').attr('src') == '/src/assets/img/common/check.png'){
            payType = Dict_pay.WECHAT
        }
    } else if ($('#goldCheck').attr('src') == '/src/assets/img/common/no.png') {
        $('#goldCheck').attr('src', '/src/assets/img/common/yes.png')
        if (parseInt(price*100)<=parseInt(gold*100)) {
            payType = Dict_pay.BILLOWS
            refreshPayBtn()
        }
        else if(parseInt(price*100)>parseInt(gold*100)){
            if(($('#alipay').children('.check').attr('src') == '/src/assets/img/common/check.png' )||($('#wechatpay').children('.check').attr('src') == '/src/assets/img/common/check.png')) {
                refreshPayBtn()
            }
            else {
               $('#pay').children('button').removeClass('active') 
            }
        }
    }
}
/**
    是否支付
    @param
    @return {Boolean} 是否支付
*/
function isPay() {
    if (payType != '' || price == 0||(($('#goldCheck').attr('src') == '/src/assets/img/common/yes.png')&&(parseInt(price*100)<=parseInt(gold*100)))) {
        $('#pay').children('button').addClass('active')
        if(($('#goldCheck').attr('src') == '/src/assets/img/common/yes.png')&&(parseInt(price*100)<=parseInt(gold*100))) {
            payType = Dict_pay.BILLOWS
        }
        return true
    }
    return false
}
/**
    刷新支付按钮
    @param
    @return
*/
function refreshPayBtn() {
    if (isPay()) {
        $('#pay').children('button').addClass('active')
    }
}

/**
    各种支付
    @param
    @return
*/
const wm_common = {
    /**
        支付
        @param
        @return
    */
    pay: function(param) {
        if (price == 0) {
            param.pay_method = Dict_pay.ALI //免密支付：支付方式随机
            this.freePay(param)
            return
        }
        if ($('#goldCheck').attr('src') == '/src/assets/img/common/yes.png') {
            if (parseInt(price*100)>parseInt(gold*100)) {
                if (browserType == 'browser') {
                    if ($('#alipay').children('.check').attr('src') == '/src/assets/img/common/check.png') {
                        payType = Dict_pay.ALI
                        this.browserALIPay(param)
                    } else if ($('#wechatpay').children('.check').attr('src') == '/src/assets/img/common/check.png') {
                        payType = Dict_pay.WECHAT
                        this.browserWechatPay(param)
                    }
                } else if (browserType == 'wechat') {
                    if ($('#wechatpay').children('.check').attr('src') == '/src/assets/img/common/check.png') {
                        payType = Dict_pay.WECHAT
                        this.wechatPay(param)
                    }
                }
            }
            else if(parseInt(price*100)<=parseInt(gold*100)) {
                payType = Dict_pay.BILLOWS
                this.goldPay(param)
            }
        }
        else {
            if (browserType == 'browser') {
                if ($('#alipay').children('.check').attr('src') == '/src/assets/img/common/check.png') {
                    payType = Dict_pay.ALI
                    this.browserALIPay(param)
                } else if ($('#wechatpay').children('.check').attr('src') == '/src/assets/img/common/check.png') {
                    payType = Dict_pay.WECHAT
                    this.browserWechatPay(param)
                }
            } else if (browserType == 'wechat') {
                if ($('#wechatpay').children('.check').attr('src') == '/src/assets/img/common/check.png') {
                    payType = Dict_pay.WECHAT
                    this.wechatPay(param)
                }
                
            }
        }
        
    },
    /**
        免密支付
        @param {Object}param 支付参数
        @return
    */
    freePay: function(param) {
        AjaxUtils.ajax({
            header: {
                REQUESTCLIENT: this.getRequestClient()
            },
            type: 'POST',
            url: pay_request+'v1/pay',
            data: param,
            success: function(result, textStatus, jqXHR) {
                if (result.code == 208) { //免密支付
                    localStorage.wm_orderid = result.data.order_id
                    localStorage.wm_goodscode = Router.getParameter('wm_product_code')
                    localStorage.wm_t1 = new Date().getTime()
                    window.location.href = wm_common.getSuccessUrl()
                } else {
                    DialogUtils.tip(result.note)
                }
                isOne = true
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
            }
        })
    },
    /**
        余额支付
        @param {Object}param 支付参数
        @return
    */
   goldPay: function(param) {
    AjaxUtils.ajax({
        header: {
            REQUESTCLIENT: this.getRequestClient()
        },
        type: 'POST',
        url: pay_request+'v1/pay',
        data: param,
        success: function(result, textStatus, jqXHR) {
            if (result.code == 308) { //余额支付
                localStorage.wm_orderid = result.data.order_id
                localStorage.wm_goodscode = Router.getParameter('wm_product_code')
                localStorage.wm_t1 = new Date().getTime()
                window.location.href = wm_common.getSuccessUrl()
            } else {
                DialogUtils.tip(result.note)
            }
            isOne = true
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    })
},
    /**
        浏览器支付宝支付
        @param {Object}param 支付参数
        @return
    */
    browserALIPay: function(param) {
        param.return_url = this.getCheckUrl()
        param.quit_url = this.getCancelUrl()
        AjaxUtils.ajax({
            header: {
                REQUESTCLIENT: this.getRequestClient()
            },
            type: 'POST',
            url: pay_request+'v1/pay',
            data: param,
            success: function(result, textStatus, jqXHR) {
                if (result.code == 200) { //跳转支付宝支付(浏览器)
                    localStorage.wm_orderid = result.data.order_id
                    localStorage.wm_goodscode = Router.getParameter('wm_product_code')
                    localStorage.wm_t1 = new Date().getTime()
                    window.location.href = result.data.payLink
                } else if(result.code == 208) { //免密支付
                    localStorage.wm_orderid = result.data.order_id
                    localStorage.wm_goodscode = Router.getParameter('wm_product_code')
                    localStorage.wm_t1 = new Date().getTime()
                    window.location.href = wm_common.getSuccessUrl()
                } else {
                    DialogUtils.tip(result.note)
                }
                isOne = true
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

            }
        })
    },
    /**
        浏览器微信支付
        @param {Object}param 支付参数
        @return
    */
    browserWechatPay: function(param) {
        AjaxUtils.ajax({
            header: {
                REQUESTCLIENT: this.getRequestClient()
            },
            type: 'POST',
            url: pay_request+'v1/pay',
            data: param,
            success: function(result, textStatus, jqXHR) {
                if (result.code == 200) { //跳转微信支付(浏览器)
                    localStorage.wm_orderid = result.data.order_id
                    localStorage.wm_goodscode = Router.getParameter('wm_product_code')
                    localStorage.wm_t1 = new Date().getTime()
                    window.location.href = result.data.pay_link+'&redirect_url='+CommonUtils.convert23(wm_common.getCheckUrl())
                } else if (result.code == 208) { //免密支付
                    localStorage.wm_orderid = result.data.order_id
                    localStorage.wm_goodscode = Router.getParameter('wm_product_code')
                    localStorage.wm_t1 = new Date().getTime()
                    window.location.href = wm_common.getSuccessUrl()
                } else {
                    DialogUtils.tip(result.note)
                }
                isOne = true
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
            }
        })
    },
    /**
        微信支付
        @param {Object}param 支付参数
        @return
    */
    wechatPay: function(param) {
        param.openid = Router.getParameter('wm_wechat_openid')
        AjaxUtils.ajax({
            header: {
                REQUESTCLIENT: this.getRequestClient()
            },
            type: 'POST',
            url: pay_request+'v1/pay',
            data: param,
            success: function(result, textStatus, jqXHR) {
                if (result.code == 200) { //跳转微信支付(微信环境)
                    const onBridgeReady = function() {
                        WeixinJSBridge.invoke('getBrandWCPayRequest', {
                            'appId': result.data.appId,
                            'timeStamp': result.data.timeStamp,
                            'nonceStr': result.data.nonceStr,
                            'package': result.data.package,
                            'signType': result.data.signType,
                            'paySign': result.data.paySign
                        }, (res)=> {
                            if (res.err_msg == 'get_brand_wcpay_request:ok') {
                                DialogUtils.tip('支付成功', function() {
                                    localStorage.wm_orderid = result.data.order_id
                                    localStorage.wm_goodscode = Router.getParameter('wm_product_code')
                                    localStorage.wm_t1 = new Date().getTime()
                                    window.location.href = wm_common.getCheckUrl()
                                })
                            } else if(res.err_msg == 'get_brand_wcpay_request:cancel') {
                                DialogUtils.tip('支付取消')
                            } else {
                                DialogUtils.tip('支付失败'+res.err_msg+JSON.stringify(res), function() {
                                    window.location.href = wm_common.getErrorUrl()
                                })
                            }
                        })
                    }
                    if (typeof WeixinJSBridge == 'undefined') {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
                        }
                    } else {
                        onBridgeReady()
                    }
                } else if(result.code == 208) { //免密支付
                    localStorage.wm_orderid = result.data.order_id
                    localStorage.wm_goodscode = Router.getParameter('wm_product_code')
                    localStorage.wm_t1 = new Date().getTime()
                    window.location.href = wm_common.getSuccessUrl()
                } else {
                    DialogUtils.tip(result.note)
                }
                isOne = true
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
            }
        })
    },
    /**
        获取校验跳转链接
        @param
        @return {String} 校验链接
    */
    getCheckUrl: function() {
        return window.location.origin+'/#/mall/check'
    },
    /**
        获取支付成功跳转链接
        @param
        @return {String} 支付成功链接
    */
    getSuccessUrl: function() {
        return back_path_wm+'pay/success'+localStorage.wm_successParam+'&wm_orderid='+localStorage.wm_orderid
    },
    /**
        获取支付失败跳转链接
        @param
        @return {String} 支付失败链接
    */
    getErrorUrl: function() {
        return back_path_wm+'pay/error'
    },
    /**
        获取支付取消跳转链接
        @param
        @return {String} 支付取消链接
    */
    getCancelUrl: function() {
        return back_path_wm+'pay/cancel'
    },
    /**
        获取支付客户端
        @param
        @return {String} 支付客户端
    */
    getRequestClient: function() {
        if (browserType == 'browser') {
            return '4'
        } else if (browserType == 'wechat') {
            return '6'
        }
        return ''
    }
}

