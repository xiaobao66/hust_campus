requirejs.config({
    baseUrl: "scripts",
    paths: {
        'zepto': 'lib/zepto'
    },
    shim: {
        'zepto': {
            exports: 'Zepto'
        }
    }
});

requirejs(['zepto', 'src/lib-util'], function($, util) {
    var mes = {
        hintOrigin: '请输入图书名称',
        loadingFail: "服务器君失联了,请检查一下您的网络"
    };

    // var data = {
    //     "code": 200,
    //     "msg": "success",
    //     "data": [{
    //         "id": "b2576057",
    //         "title": "银河帝国",
    //         "picture": "http://202.114.9.17/bibimage/zycover.php?isbn=9787539949796",
    //         "counts": 92
    //     }, {
    //         "id": "b1893819",
    //         "title": "藏地密码",
    //         "picture": "http://202.114.9.17/bibimage/zycover.php?isbn=9787536679870",
    //         "counts": 82
    //     }, {
    //         "id": "b1819155",
    //         "title": "匆匆那年",
    //         "picture": "http://202.114.9.17/bibimage/zycover.php?isbn=9787506030328",
    //         "counts": 51
    //     }]
    // };

    //初始化热门书籍
    function initHot() {
        $.ajax({
            url: '/lib/hot',
            type: 'GET',
            beforeSend: function() {
                $(".loading").show();
                $('.load-origin').show();
            },
            error: function() {
                util.showErr(mes.loadingFail);
            },
            success: function(data) {
                util.loadHotBook(data.data, $('#hot-result'));
                $('#hot-result span').on('touchstart', function(e) {
                    e.preventDefault();
                    var info = {
                        bookId: $(e.target).attr('book-id'),
                        keywords: $(e.target).text()
                    };
                    window.location.href = util.encodeURL('library-detail.html', info);
                });
                $(".loading").hide();
                $('.load-origin').hide();
            }
        });
    }

    $(function() {
        var hint = $('.search > span'),
            confirm = $('.search > i'),
            userInput = $('#user-input');
        //初始化加载热门图书
        initHot();
        if (userInput.val()) {
            hint.removeClass('hint-origin').addClass('hint-focus');
            hint.text('');
            confirm.show();
        }
        //搜索栏动态效果设置
        userInput.on('touchstart', function(e) {
            if (hint.hasClass('hint-origin')) {
                hint.removeClass('hint-origin').addClass('hint-focus');
                hint.text('');
                confirm.show();
            }
        }).on('blur', function(e) {
            if ($(this).val() === '') {
                hint.removeClass('hint-focus').addClass('hint-origin');
                hint.text(mes.hintOrigin);
                confirm.hide();
            }
        });
        // //加载热门书籍
        // util.loadHotBook(data.data, $('#hot-result'));
        //确认搜索
        confirm.on('touchstart', function(e) {
            e.preventDefault();
            userInput.blur();
            var inputContent = userInput.val(),
                search = {
                    keywords: inputContent
                };
            if (inputContent !== '') {
                window.location.href = util.encodeURL('library-result.html', search);
            }
        });
        $("#user-input").on('keyup', function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                var inputContent = userInput.val(),
                    search = {
                        keywords: inputContent
                    };
                if (inputContent !== '') {
                    window.location.href = util.encodeURL('library-result.html', search);
                }
            }
        });

        $("#download").tap(function() {
            util.count("http://s95.cnzz.com/z_stat.php?id=1256730708&web_id=1256730708");
        });
    });
});
