var AjaxUtils = {
    /**
        发送ajax
        @param {Object}param 参数
        @return
    */
    ajax: function(param) {
        $.support.cors = true
        if (param.type === 'POST') {
            param.data = JSON.stringify(attestation(param.data))
        }
        $.ajax({
            headers: {
                'REQUESTAPP': param.header.REQUESTAPP, //APP编号：澜渟-1，澜渟私教-2，澜婷医生-3；
                'REQUESTCLIENT': param.header.REQUESTCLIENT, //客户端类型编号：Android-1，iOS-2，PC-3，H5-4，小程序-5，公众号-6
                'Content-Type': 'application/json',
                'VERSIONFORAPP': param.header.VERSIONFORAPP
            },
            async: true,
            contentType: 'application/json',
            url: encodeURI(param.url),
            type: param.type,
            data: param.data,
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                param.success(data, textStatus, jqXHR)
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                param.error(XMLHttpRequest, textStatus, errorThrown)
            }
        })
    }
}

// 验签方法
function attestation(postData) {
    var timestamp = getTimestamp()
    var nonce = getNonce()
    postData.timestamp = timestamp
    postData.nonce = nonce
    var sort_ascii = sort_ASCII(postData)
    var objGet = objArgs(sort_ascii)
    var strMd5 = md5(objGet)
    var sign = strMd5.toUpperCase()
    postData.sign = sign
    return postData
}

// 获取当前毫秒时间戳
function getTimestamp() {
    var timestamp = new Date().getTime()
    return timestamp
}
// 获取32位随机字符串
function getNonce () {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    var nums = ""
    for (var i = 0; i < 32; i++) {
        var id = parseInt(Math.random() * 61)
        nums += chars[id]
    }
    return nums
}
// Js对象按ASCII码排序
function sort_ASCII(obj) {
    var arr = new Array()
    var num = 0
    for (var i in obj) {
        arr[num] = i
        num++
    }
    var sortArr = arr.sort()
    var sortObj = {}
    for (var i in sortArr) {
        sortObj[sortArr[i]] = obj[sortArr[i]]
    }
    return sortObj
}
// post请求转换成get请求
function objArgs(obj) {
    var url = ''
    for (var name in obj) {
        url += name + '=' + obj[name] + '&' // 转码并进行赋值
    }
    url += "secret=BCy94HkqITdAJDCPhw9Sjd6TwLoV8igR"
    return url // 返回
}

