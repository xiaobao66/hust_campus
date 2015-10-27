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
        loadingFail: "服务器君失联了,请检查一下您的网络"
    };
    // var data = {
    //     "code": 200,
    //     "msg": "success",
    //     "data": {
    //         "title": "高质量程序设计指南 : C++/C语言 / 林锐, 韩永泉编著",
    //         "author": "林锐, 1973- 编著",
    //         "publisher": "北京 : 电子工业出版社, 2007",
    //         "isbn": "978-7-121-04114-3 CNY39.80",
    //         "picture": "http://202.114.9.17/bibimage/zycover.php?isbn=9787121041143",
    //         "collections": [{
    //             "place": "中文图书阅览室（C区2楼，3楼，5楼）",
    //             "index": "TP312C 848/3",
    //             "status": "馆内阅览"
    //         }, {
    //             "place": "流通书库(B区)",
    //             "index": "TP312C 848/3",
    //             "status": "在架上"
    //         }, {
    //             "place": "流通书库(B区)",
    //             "index": "TP312C 848/3",
    //             "status": "在架上"
    //         }, {
    //             "place": "东校区分馆阅览室",
    //             "index": "TP312C 848/3",
    //             "status": "馆内阅览"
    //         }, {
    //             "place": "东校区分馆借还处",
    //             "index": "TP312C 848/3",
    //             "status": "在架上"
    //         }, {
    //             "place": "中文图书阅览室（C区2楼，3楼，5楼）",
    //             "index": "TP312C 848/3",
    //             "status": "馆内阅览"
    //         }, {
    //             "place": "中文图书阅览室（C区2楼，3楼，5楼）",
    //             "index": "TP312C 848/3",
    //             "status": "馆内阅览"
    //         }],
    //         "description": ""
    //     }
    // };

    //初始化图书详情
    function initDetail(keywords, nodes) {
        $.ajax({
            url: '/lib/' + keywords,
            type: 'GET',
            beforeSend: function() {
                $(".loading").show();
                $('.load-origin').show();
            },
            error: function() {
                util.showErr(mes.loadingFail);
            },
            success: function(data) {
                util.loadDetail(data.data, nodes, function() {
                    var top = $(".book-detail").height();
                    $('#show-table').css('top', top + 'px');
                    $(".loading").hide();
                    $('.load-origin').hide();
                    $('.lib-main').css('visibility', 'visible');
                });
            }
        });
    }
    $(function() {
        var search = decodeURIComponent(window.location.search),
            info = search.split('&'),
            bookId = info[0].split('=')[1],
            keywords = info[1].split('=')[1],
            nodes = {
                img: document.getElementById('pic-img'),
                name: $('.book-name'),
                author: $('.book-author'),
                isbn: $('.book-isbn'),
                publisher: $('.book-publisher'),
                parent: $('.book-record > tbody'),
                main: $('#show-table')
            };
        // $('.thumb-window').height();
        $('header > a').on('touchstart', function(e) {
            e.preventDefault();
            var search = {
                keywords: keywords
            };
            window.location.href = util.encodeURL('library-result.html', search);
        });
        initDetail(bookId, nodes);
        // util.loadDetail(data.data, nodes, function() {
        //     var top = $(".book-detail").height();
        //     $('#show-table').css('top', top + 'px');
        //     $(".loading").hide();
        //     $('.load-origin').hide();
        //     $('.lib-main').css('visibility', 'visible');
        // });
        // $('.lib-main').show();
    });
});
