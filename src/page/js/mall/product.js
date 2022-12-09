/**
 * 文件描述：支付页
 * 创建人：赵志银
 * 创建时间：2019-03-14
*/
var payType = '';
var goldPrice = '';
var price = Router.getParameter('wm_price');
var gold = Router.getParameter('wm_gold');
var goodstype = Router.getParameter('wm_goodstype');
var browserType = CommonUtils.getBrowserType();
var isOne = true
var isSuccess = false

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
    const successUrl = '?wm_referral_code='+Router.getParameter('wm_referral_code')
    +'&wm_sn='+Router.getParameter('wm_sn')
    +'&wm_token='+Router.getParameter('wm_token')
    localStorage.wm_successParam = successUrl
    localStorage.wm_token = Router.getParameter('wm_token')
    if(CommonUtils.isEmpty(localStorage.wm_paytime)) {
        localStorage.wm_paytime = Router.getParameter('wm_time')
    }
}

/**
    初始化页面
    @param
    @return
*/
function initPage() {
    $('#main').addClass(browserType)
    $('#info').show()
    $('#message').show()
    $('#goldCheck').attr('src', '/src/assets/img/common/yes.png')
    if (price != '0') {
        $('#price').text('￥'+Number(price).toFixed(2)).show()
        $('#gold').text('余额'+Number(gold)+'元') 
        $('#payType').show()
        $('#pay').children('button').text('去支付')
        CommonUtils.setTitle('支付中心')
    } else {
        $('#price').hide()
        $('#payType').hide()
        $('#pay').children('button').text('确认订单')
        CommonUtils.setTitle('确认订单')
    }
    if(goodstype!='4') {
        $('#goldcontent').show()
    } else {
        $('#goldcontent').hide()
        $('#goldCheck').attr('src','/src/assets/img/common/no.png')
    }
    if (browserType == 'browser') {
        $('#alipay').show()
        $('#ali').show()
        $('#wei').hide()
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
    if(isOne) {
        isOne = false
        if(Router.getParameter('wm_product_code')==localStorage.wm_goodscode) {
            if(localStorage.wm_paytime == Router.getParameter('wm_time')) {
                if(((new Date().getTime())-localStorage.wm_t1<=60000)&&!isSuccess){
                    isSuccess = true
                    DialogUtils.tip('订单已支付，一分钟内请勿重复支付')
                    isOne = true
                    return
                }
            } else {
                localStorage.wm_paytime = Router.getParameter('wm_time')
            }
        }
        isSuccess = false
        if (!isPay()) {
            return
        }
        if ($('#goldCheck').attr('src') == '/src/assets/img/common/yes.png') {
            if (parseInt(price*100) <= parseInt(gold*100)) {
                goldPrice = (Number(price)*1000)/10
            }
            else{ 
                goldPrice = (Number(gold)*1000)/10
            }
        }
        else if($('#goldCheck').attr('src') == '/src/assets/img/common/no.png') {
            goldPrice = 0
        }
        if (CommonUtils.isEmpty(Router.getParameter('wm_coupon_code'))){
            if (!CommonUtils.isEmpty(Router.getParameter('wm_referral_code'))){
                wm_common.pay({
                    token: localStorage.wm_token,
                    pay_method: payType,
                    product_code: Router.getParameter('wm_product_code'),
                    warranty_code: Router.getParameter('wm_service_code'),
                    product_count: Router.getParameter('wm_goods_count'),
                    product_type: Dict_Product.MALL_PRODUCT,
                    recipient_name: decodeURI(Router.getParameter('wm_name')),
                    recipient_address: decodeURI(Router.getParameter('wm_addr')),
                    recipient_phone: Router.getParameter('wm_phone'),
                    product_tag: decodeURI(Router.getParameter('wm_product_tag')),
                    product_tag_code: Router.getParameter('wm_product_tag_code'),
                    remark: decodeURI(Router.getParameter('wm_remark')),
                    referral_code: Router.getParameter('wm_referral_code'),
                    sn: Router.getParameter('wm_sn'),
                    gold: goldPrice
                })
            }
            else if (CommonUtils.isEmpty(Router.getParameter('wm_referral_code'))){
                wm_common.pay({
                    token: localStorage.wm_token,
                    pay_method: payType,
                    product_code: Router.getParameter('wm_product_code'),
                    warranty_code: Router.getParameter('wm_service_code'),
                    product_count: Router.getParameter('wm_goods_count'),
                    product_type: Dict_Product.MALL_PRODUCT,
                    recipient_name: decodeURI(Router.getParameter('wm_name')),
                    recipient_address: decodeURI(Router.getParameter('wm_addr')),
                    recipient_phone: Router.getParameter('wm_phone'),
                    product_tag: decodeURI(Router.getParameter('wm_product_tag')),
                    product_tag_code: Router.getParameter('wm_product_tag_code'),
                    remark: decodeURI(Router.getParameter('wm_remark')),
                    gold: goldPrice
                })
            }
        }
        else if (!CommonUtils.isEmpty(Router.getParameter('wm_coupon_code'))){
            wm_common.pay({
                token: localStorage.wm_token,
                pay_method: payType,
                product_code: Router.getParameter('wm_product_code'),
                warranty_code: Router.getParameter('wm_service_code'),
                product_count: Router.getParameter('wm_goods_count'),
                product_type: Dict_Product.MALL_PRODUCT,
                recipient_name: decodeURI(Router.getParameter('wm_name')),
                recipient_address: decodeURI(Router.getParameter('wm_addr')),
                recipient_phone: Router.getParameter('wm_phone'),
                product_tag: decodeURI(Router.getParameter('wm_product_tag')),
                product_tag_code: Router.getParameter('wm_product_tag_code'),
                coupon_code: Router.getParameter('wm_coupon_code'),
                remark: decodeURI(Router.getParameter('wm_remark')),
                gold: goldPrice
            })
        }
    }
}
