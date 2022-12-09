/**
 * 文件描述：支付页
 * 创建人：赵志银
 * 创建时间：2020-04-14
*/

var payType = ''
var balancePrice = 0
var balance = 0
var price = 0       //商品价格
var payPrice = 0   //应付
var couponCode = ''
var couponPrice = 0
var couponListArr = []
var collegeType = Router.getParameter('type')  //类型：2-课程，3-专栏，11-直播
var isRetail = Router.getParameter('isRetail')    //是否分销
var browserType = CommonUtils.getBrowserType()
var isOne = true

$(function() {
    DialogUtils.loading('main')
    CommonUtils.setTitle('澜渟极致学院')
    initPage()
})

/**
 初始化页面
 @param
 @return
 */
function initData() {
    if(isRetail == 1) {
        $('#couponBtn').hide()
        initBalance()
    } else {
        $('#couponBtn').show()
        initCoupon()
    }
}

/**
    初始化页面
    @param
    @return
*/
function initPage() {
    localStorage.token = Router.getParameter('token')
    $('#main').addClass(browserType)
    $('#info').show()
    $('#message').show()
    $('#phone').text('购买内容将放入账号'+Router.getParameter('phone'))

    let dadaObj = {
        token: localStorage.token,
        product_code: Router.getParameter('code'),
        product_type: Router.getParameter('type')
    }
    if(!CommonUtils.isEmpty(Router.getParameter('refCode'))) {
        dadaObj.referral_code = Router.getParameter('refCode')
    } 
    AjaxUtils.ajax({
        header: {
            REQUESTCLIENT: 6
        },
        type: 'POST',
        url:  live + 'reexam/order/pay-detail',
        data: dadaObj,
        success: function(result, textStatus, jqXHR) {
            if (result.code == 200) { 
                var data = result.data
                $('#price').text('￥'+CommonUtils.priceTransitionFlex(data.old_price))
                price = data.old_price
                payPrice = data.pay_price
                if(collegeType==2) {
                    $('#type').removeClass('goodsSpe')
                    $('#type').removeClass('goodsLive')
                    $('#type').addClass('goodsLess')
                    $('#type>div').text('课程')   //课程
                } else if(collegeType==3) {
                    $('#type').removeClass('goodsLess')
                    $('#type').removeClass('goodsLive')
                    $('#type').addClass('goodsSpe')
                    $('#type>div').text('专栏')  //专栏
                } else if(collegeType==11) {
                    $('#type').removeClass('goodsLess')
                    $('#type').removeClass('goodsSpe')
                    $('#type').addClass('goodsLive')
                    $('#type>div').text('直播')   //直播
                }
                $('#cover').attr('src',data.product_img + CommonUtils.shearImg(84,84,84))
                $('#collegename').text(data.product_name)
                $('#goods').show()
                DialogUtils.hideLoading('main')
                if(data.is_canretail == 1) {
                    isRetail = 1
                } else {
                    isRetail = 0
                }
                initData()
            } else {
                DialogUtils.tip(result.note)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert('result.code')
        }
    })
    setCheck("1")
    refreshPayBtn()
}

/**
    初始化余额
    @param
    @return
*/
function initBalance() {
    AjaxUtils.ajax({
        header: {
            REQUESTCLIENT: 6
        },
        type: 'POST',
        url: rih + 'v1/account/info',
        data: {
            token: localStorage.token
        },
        success: function(result, textStatus, jqXHR) {
            if (result.code == 200) { 
                var data = result.data
                balance = Number(data.balance)
                $('#balanceData').text('余额(元)：'+CommonUtils.priceTransitionFlex(data.balance))
                $('#payType').show()
                
                if(isRetail==1) {
                    payPrice = price - balance
                } else {
                    if(CommonUtils.isEmpty(couponCode)) {
                        payPrice = price - balance
                    } else {
                        payPrice = price - balance - couponPrice 
                    }
                }
                if(payPrice<0) {
                    $('#payPrize').text('0.00')
                } else {
                    $('#payPrize').text(CommonUtils.priceTransitionFlex(payPrice))
                }
                gCheck()
                DialogUtils.hideLoading('main')
                refreshPayBtn()
            } else {
                DialogUtils.tip(result.note)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    })
}

/**
    初始化优惠券
    @param
    @return
*/
function initCoupon() {
    AjaxUtils.ajax({
        header: {
            REQUESTCLIENT: 6
        },
        type: 'POST',
        url: rih + 'v1/coupon/canuse',
        data: {
            for_where: Router.getParameter('type'),
            pay_count: Router.getParameter('price'),
            token: localStorage.token,
            where_code: Router.getParameter('code')
        },
        success: function(result, textStatus, jqXHR) {
            if (result.code == 200) { 
                var data = result.data
                if(CommonUtils.isEmpty(data)) {
                    $('#coupon').text('暂无可用优惠券')
                } else {
                    couponListArr = data
                    initCouponPage()
                    couponCode = data[0].code
                    couponPrice = Number(data[0].amount)
                    $('#coupon').text('优惠'+CommonUtils.priceTransition(data[0].amount)+'元')
                    payPrice = price - data[0].amount
                    if(payPrice<0) {
                        $('#payPrize').text('0.00')
                    } else {
                        $('#payPrize').text(CommonUtils.priceTransitionFlex(payPrice))
                    }
                }
                refreshPayBtn()
                initBalance()
                DialogUtils.hideLoading('main')
            } else {
                DialogUtils.tip(result.note)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    })
}

/**
    关闭优惠券
    @param
    @return
*/
function closeDialog() {
    $('#cont').removeClass('comeIn')
    $('#cont').addClass('comeOut')
    var timeout = setTimeout(()=>{
        $('html').css({
            position:'static',
            overflow:' visible'
        })
        $('body').css({
            position:'static',
            overflow:' visible'
        })
        clearTimeout(timeout)
        $('#couponDialog').hide()
        if(CommonUtils.isEmpty(couponCode)) {
            $('.list').each(function(index,element){
                $(this).find('.btn').attr('src','/src/assets/img/college/no.png?t='+(new Date()).getTime())
            })
        } else {
            $('.list').each(function(index,element){
                if(couponCode == $(this).attr('data-code')) {
                    $(this).find('.btn').attr('src','/src/assets/img/college/yes.png?t='+(new Date()).getTime())
                } else {
                    $(this).find('.btn').attr('src','/src/assets/img/college/no.png?t='+(new Date()).getTime())
                }
            })
        }
    },300)
}

/**
    选择优惠券
    @param
    @return
*/
function chooseCoupon() {
    if($('#coupon').text()=='暂无可用优惠券') {
        DialogUtils.tip('暂无可用优惠券')
    } else {
        $('#couponDialog').show()
        $('#cont').removeClass('comeOut')
        $('#cont').addClass('comeIn')
        $('html').css({
            position:'fixed',
            overflow:' hidden'
        })
        $('body').css({
            position:'fixed',
            overflow:' hidden'
        })
    }
}

/**
    初始化优惠券弹窗内容
    @param
    @return
*/
function initCouponPage() {
    couponListArr.map((item)=>{
        if(item.common_type==0) {
            if(item.type==1) {
                $('#couponCont').append(`<div class='list' data-code=${item.code} data-amount=${item.amount}>
                <div class='price'>
                    <img src='/src/assets/img/college/cur.png'>
                    <div class='num'>${CommonUtils.priceTransition(item.amount)}</div>
                    <div>满${CommonUtils.priceTransition(item.full_value)}减${CommonUtils.priceTransition(item.amount)}</div>
                </div>
                <div class='info'>
                    <div class='name'>${item.name}</div>
                    <div class='time'>${item.begin_date.replace(/-/g, '.')}-${item.end_date.replace(/-/g, '.')}</div>
                    <img src='/src/assets/img/college/no.png?t=${(new Date()).getTime()}' class='btn'>
                </div>
            </div>`)
            } else {
                $('#couponCont').append(`<div class='list' data-code=${item.code} data-amount=${item.amount}>
                <div class='price'>
                    <img src='/src/assets/img/college/cur.png'>
                    <div class='num'>${CommonUtils.priceTransition(item.amount)}</div>
                </div>
                <div class='info'>
                    <div class='name'>${item.name}</div>
                    <div class='time'>${item.begin_date.replace(/-/g, '.')}-${item.end_date.replace(/-/g, '.')}</div>
                    <img src='/src/assets/img/college/no.png?t=${(new Date()).getTime()}' class='btn'>
                </div>
            </div>`)
            }
        } else {
            if(item.type==1) {
                $('#couponCont').append(`<div class='list' data-code=${item.code} data-amount=${item.amount}>
                <div class='price'>
                    <img src='/src/assets/img/college/pri.png'>
                    <div class='num'>${CommonUtils.priceTransition(item.amount)}</div>
                    <div>满${CommonUtils.priceTransition(item.full_value)}减${CommonUtils.priceTransition(item.amount)}</div>
                </div>
                <div class='info'>
                    <div class='name'>${item.name}</div>
                    <div class='time'>${item.begin_date.replace(/-/g, '.')}-${item.end_date.replace(/-/g, '.')}</div>
                    <img src='/src/assets/img/college/no.png?t=${(new Date()).getTime()}' class='btn'>
                </div>
            </div>`)
            } else {
                $('#couponCont').append(`<div class='list' data-code=${item.code} data-amount=${item.amount}>
                <div class='price'>
                    <img src='/src/assets/img/college/pri.png'>
                    <div class='num'>${CommonUtils.priceTransition(item.amount)}</div>
                </div>
                <div class='info'>
                    <div class='name'>${item.name}</div>
                    <div class='time'>${item.begin_date.replace(/-/g, '.')}-${item.end_date.replace(/-/g, '.')}</div>
                    <img src='/src/assets/img/college/no.png?t=${(new Date()).getTime()}' class='btn'>
                </div>
            </div>`)
            }
        }
    })
    $('#couponCont>div:nth-of-type(1)').find('.btn').attr('src','/src/assets/img/college/yes.png?t='+(new Date()).getTime())
    $('.list').bind("click",function(event){
        if($(this).find('.btn')[0].src.indexOf('/src/assets/img/college/yes.png')!=-1) {
            $('.list .info img').attr('src','/src/assets/img/college/no.png')
            $(this).find('.btn').attr('src','/src/assets/img/college/no.png?t='+(new Date()).getTime())
        } else {
            $('.list .info img').attr('src','/src/assets/img/college/no.png')
            $(this).find('.btn').attr('src','/src/assets/img/college/yes.png?t='+(new Date()).getTime())
        }
        return false
    })
    $('#cont').bind("click",function(event){
        return false
    })
}

/**
    点击优惠券完成按钮
    @param
    @return
*/
$('#comBtn>div').bind("click",function(event){
    var isHas = false
    $('.list').each(function(index,element){
        if($(this).find('.btn')[0].src.indexOf('/src/assets/img/college/yes.png')!=-1) {
            isHas = true
            couponCode = $(this).attr('data-code')
            couponPrice = Number($(this).attr('data-amount'))
            $('#coupon').text('优惠'+CommonUtils.priceTransition($(this).attr('data-amount'))+'元')
        }
        if((index === $('.list').length-1)) {
            if(!isHas) {
                couponCode = ''
                couponPrice = 0
                $('#coupon').text('请选择优惠券')
            }
        }
    })
    if($('#goldCheck').attr('src') == '/src/assets/img/college/yesbtn.png') {
        payPrice = price - balance - couponPrice
    } else {
        payPrice = price - couponPrice
    }
    if(payPrice<0) {
        $('#payPrize').text('0.00')
    } else {
        $('#payPrize').text(CommonUtils.priceTransitionFlex(payPrice))
    }
    closeDialog()
    return false
})

/**
    去支付
    @param
    @return
*/
function pay() {
    if(isOne) {
        isOne = false
        if (!isPay()) {
            return
        }
        if ($('#goldCheck').attr('src') == '/src/assets/img/college/yesbtn.png') {
            if (price <= balance) {
                balancePrice = price
            } else{ 
                balancePrice = balance
            }
        } else if($('#goldCheck').attr('src') == '/src/assets/img/common/no.png') {
            balancePrice = 0
        }
        var paramObj = {
            token: localStorage.token,
            pay_method: payType,
            product_code: Router.getParameter('code'),
            product_type: Router.getParameter('type'),  //2-课程，3-专栏，11-直播
            product_count: 1
        }
        if(balancePrice!=0) {
            paramObj.gold = balancePrice
        }
        if(!CommonUtils.isEmpty(couponCode)) {
            paramObj.coupon_code = couponCode
        }
        if(!CommonUtils.isEmpty(Router.getParameter('refCode'))) {
            paramObj.referral_code = Router.getParameter('refCode')
        }
        md_common.pay(paramObj)
    }
}
