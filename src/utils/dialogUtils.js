var DialogUtils = {
    /**
        提示框
        @param {String}str 内容
        @param {Function}callback 回调函数
        @return
    */
    tip: function(str, callback) {
        if ($('#dialog').length === 0) {
            $('body').append('<div id="dialog"></div>')
        }
        var $tipDiv = $('<div class="tip">' + str + '</div>')
        $('#dialog').append($tipDiv).show()
        setTimeout(function() {
            DialogUtils.hide()
            if (typeof(callback) === 'function') {
                callback()
            }
        }, 2000)
    },
    /**
        内容框
        @param {String}content 内容
        @return
    */
    content: function(content) {
        if ($('#dialog').length === 0) {
            $('body').append('<div id="dialog"></div>')
        }
        $('#dialog').addClass('shade').append(content).show()
    },
    /**
        移除弹出框
        @param {String}str 内容
        @return
    */
    hide: function() {
        $('#dialog').html('').hide()
    },

    /**
        加载中
        @param {String}divId div的id
        @return
    */
    loading: function(divId) {
        $('#'+divId).addClass('pos_relative').append('<div class="loading"></div>')
    },
    /**
        移除加载中
        @param {String}divId div的id
        @return
    */
    hideLoading: function(divId) {
        $('#'+divId).removeClass('pos_relative').children('.loading').remove()
    }
}