//支付类型
const Dict_pay = {
    ALI: '0', //支付宝支付
    WECHAT: '1' //微信支付
    //2 - 银联、3 - Apple Pay、4 - 免费支付、5 - 澜渟币
}
//预约类型
const Dict_Appoint = {
    SHOP: '1', //到店服务
    HOME: '2', //上门服务
    ALL: '0' //到店服务/上门服务
}
//项目类型
const Dict_Product = {
    //1 - 考试、2 - 课程、3 - 专栏、4 - 会议门票、5 - 会议讲义、6 - 评估、7 - 澜渟币 、8 - 方案、9 - 定制方案、10 - 会议视频、11 - 直播 12-澜渟设备
    RECOVERY_PRODUCT: '13', //产康到家-项目
    RECOVERY_SERVICE: '14' //产康到家-服务
}

/**
    预约类型
    @param {Number}val 字典值
    @return {String} 字典描述
*/
function getAppointType(val) {
    if (val == Dict_Appoint.ALL) {
        return '到店服务/上门服务'
    } else if (val == Dict_Appoint.SHOP) {
        return '到店服务'
    } else if (val == Dict_Appoint.HOME) {
        return '上门服务'
    }
    return val
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
    是否支付
    @param
    @return {Boolean} 是否支付
*/
function isPay() {
    if (payType != '' || price == '0') {
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

const rv_common = {
    /**
        支付
        @param
        @return
    */
    pay: function(param) {
        if (price == '0') {
            param.pay_method = Dict_pay.ALI //免密支付：支付方式随机
            this.freePay(param)
            return
        }
        if (browserType == 'browser') {
            if (payType == Dict_pay.ALI) {
                this.browserALIPay(param)
            } else if (payType == Dict_pay.WECHAT) {
                this.browserWechatPay(param)
            }
        } else if (browserType == 'wechat') {
            this.wechatPay(param)
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
                    window.location.href = rv_common.getSuccessUrl(result.data)
                } else {
                    DialogUtils.tip(result.note)
                }
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
                    localStorage.rv_orderid = result.data.order_id
                    window.location.href = result.data.payLink
                } else if(result.code == 208) { //免密支付
                    window.location.href = rv_common.getSuccessUrl(result.data)
                } else {
                    DialogUtils.tip(result.note)
                }
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
                    localStorage.rv_orderid = result.data.order_id
                    window.location.href = result.data.pay_link+'&redirect_url='+CommonUtils.convert23(rv_common.getCheckUrl())
                } else if (result.code == 208) { //免密支付
                    window.location.href = rv_common.getSuccessUrl(result.data)
                } else {
                    DialogUtils.tip(result.note)
                }
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
        param.openid = Router.getParameter('rv_wechat_openid')
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
                                    localStorage.rv_orderid = result.data.order_id
                                    window.location.href = rv_common.getCheckUrl()
                                })
                            } else if(res.err_msg == 'get_brand_wcpay_request:cancel') {
                                DialogUtils.tip('支付取消')
                            } else {
                                DialogUtils.tip('支付失败'+res.err_msg+JSON.stringify(res), function() {
                                    window.location.href = rv_common.getErrorUrl()
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
                    localStorage.rv_orderid = result.data.order_id
                    window.location.href = rv_common.getSuccessUrl(result.data)
                } else {
                    DialogUtils.tip(result.note)
                }
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
        return window.location.origin+'/#/recovery/check'
    },
    /**
        获取支付成功跳转链接
        @param {Object}param 参数
        @return {String} 支付成功链接
    */
    getSuccessUrl: function(param) {
        let url = back_path_rv+'user/pay/success'+localStorage.rv_successParam
        if (CommonUtils.isEmpty(param)) {
            return url
        }
        if (!CommonUtils.isEmpty(param.project_member_id)) { //项目
            return url + ';rv_projectCode:'+param.code
        }
        if (!CommonUtils.isEmpty(param.service_id)) { //预约服务
            return url + ';rv_serviceId:'+param.service_id
        }
        return url
    },
    /**
        获取支付失败跳转链接
        @param
        @return {String} 支付失败链接
    */
    getErrorUrl: function() {
        return back_path_rv+'user/pay/error'
    },
    /**
        获取支付取消跳转链接
        @param
        @return {String} 支付取消链接
    */
    getCancelUrl: function() {
        return back_path_rv+'user/pay/cancel'
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