requirejs.config({
    baseUrl: "scripts",
    paths: {
        'zepto': 'lib/zepto.min'
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
        loadingFail: "服务器君失联了,请检查一下您的网络",
        searchNull: "未搜索到相关结果,请换个词条进行搜索"
    };
    // var data = {
    //     "code": 200,
    //     "msg": "success",
    //     "data": [{
    //         "id": "b1455973",
    //         "title": "高质量程序设计指南",
    //         "author": "林锐, 韩永泉编著",
    //         "picture": "http://202.114.9.17/bibimage/zycover.php?isbn=750538628X"
    //     }, {
    //         "id": "b1299441",
    //         "title": "计算机软件技术基础",
    //         "author": "周佩德，柏毅编著",
    //         "picture": "http://202.114.9.17/bibimage/zycover.php?isbn=7505348612"
    //     }, {
    //         "id": "b2835229",
    //         "title": "C/C++高效率教程",
    //         "author": "李春庚编著",
    //         "picture": "http://202.114.9.17/bibimage/zycover.php?isbn=9787302383901"
    //     }]
    // };

    //初始化搜索结果
    function initResult(keywords) {
        $.ajax({
            url: '/lib',
            type: 'GET',
            data: {
                keywords: keywords,
                count: 20
            },
            beforeSend: function() {
                $('.book-result').empty();
                $(".loading").show();
                $('.load-origin').show();
            },
            error: function() {
                util.showErr(mes.loadingFail);
            },
            success: function(data) {
                if (data.data.length) {
                    util.loadResult(data.data, $('.book-result'));
                    $('.book-item').on('touchstart', function(e) {
                        e.preventDefault();
                        var info = {
                            bookId: $(e.currentTarget).attr('book-id'),
                            keywords: keywords
                        };
                        window.location.href = util.encodeURL('library-detail.html', info);
                    });
                } else {
                    var hint = document.createElement('div');
                    $(hint).addClass('book-info');
                    $(hint).text(mes.searchNull);
                    $('.book-result').append(hint);
                }
                $(".loading").hide();
                $('.load-origin').hide();
            }
        });
    }
    $(function() {
        var search = decodeURIComponent(window.location.search),
            keywords = search.split('=')[1],
            userInput = $('#user-input'),
            hint = $('.search > span'),
            confirm = $('.search > i');
        userInput.val(keywords);
        initResult(keywords);
        // //加载搜索结果
        // util.loadResult(data.data, $('.book-result'));
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
        //返回上一级
        $('header > a').on('touchstart', function(e) {
            e.preventDefault();
            var search = {
                keywords: keywords
            };
            window.location.href = util.encodeURL('library-index.html', search);
        });
    });
});
