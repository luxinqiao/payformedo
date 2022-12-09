$(function() {
    initPage()
})

/**
    初始化页面
    @param
    @return
*/
function initPage() {
    $('#main').addClass(CommonUtils.getBrowserType())
    CommonUtils.fullScreenHeight(document.getElementById('main'))
    CommonUtils.setTitle('支付校验')
    let time = 5
    let clock = window.setInterval(() => {
        time--
        $('#leftTime').text(time)
        if (time <= 0) {
            window.clearInterval(clock)
            $('#waitTip').hide()
            checkPay()
        }
    }, 1000)
}

/**
    校验支付
    @param
    @return
*/
function checkPay() {
    AjaxUtils.ajax({
        header: {
            REQUESTCLIENT: '4'
        },
        type: 'POST',
        url: pay_request+'v1/success',
        data: {
            token: localStorage.rv_token,
            order_id: localStorage.rv_orderid
        },
        success: function(result, textStatus, jqXHR) {
            if (result.code == 200) {
                window.location.replace(rv_common.getSuccessUrl(result.data))
            } else {
                window.location.replace(rv_common.getErrorUrl())
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    })
}