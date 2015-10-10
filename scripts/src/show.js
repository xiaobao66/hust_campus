define(function(require, exports, module) {
    var util = require('./util'),
        data = window.location.search.split("=")[1],
        mes = {
            elecFull: "电费满满哒,空调随便使用哦",
            elecNearly: "要没电啦(o_o;)赶快去充电费哦!",
            elecEnough: "电量还是够的,用空调不要心慌慌哦"
        };

    data = decodeURIComponent(data);
    data = JSON.parse(data);
    // var data = {
    //     code: 200,
    //     msg: "success",
    //     data: {
    //         build: "西十三舍",
    //         last_update: "2015-10-6 7:30:27",
    //         remain: "99.6",
    //         room: "212",
    //         recent: {
    //             20150930: {
    //                 updated_at: "2015-9-30 7:31:24",
    //                 dianfei: "108.1"
    //             },
    //             20151001: {
    //                 updated_at: "2015-10-1 7:30:47",
    //                 dianfei: "106.1"
    //             },
    //             20151002: {
    //                 updated_at: "2015-10-2 7:30:27",
    //                 dianfei: "103.7"
    //             },
    //             20151003: {
    //                 updated_at: "2015-10-3 7:30:10",
    //                 dianfei: "102.0"
    //             },
    //             20151004: {
    //                 updated_at: "2015-10-4 7:22:56",
    //                 dianfei: "100.1"
    //             },
    //             20151005: {
    //                 updated_at: "2015-10-5 7:29:00",
    //                 dianfei: "99.8"
    //             },
    //             20151006: {
    //                 updated_at: "2015-10-6 7:30:27",
    //                 dianfei: "99.6"
    //             }
    //         }
    //     }
    // };

    $(function() {
        var average = util.averageElec(util.totalElec(data.data.recent)),
            trendHeight = $(window).height() - $("#trend-title").offset().top - 25,
            windowHeight = $(window).height(),
            remain = data.data.remain;

        document.documentElement.style.webkitTouchCallout = 'none';

        if (trendHeight > 190) {
            $("#elec-trend").height(trendHeight);
        } else {
            $("#elec-trend").height(190);
            $("body").css("height", windowHeight + 190 - trendHeight + "px");
        }
        $("#aver-number").text(average);
        $("#surplus-number").text(remain);
        if (remain > 100) {
            $("#elec-info").text(mes.elecFull);
        } else if (remain < 20) {
            $("#elec-info").text(mes.elecNearly);
        } else {
            $("#elec-info").text(mes.elecEnough);
        }
        util.surplusElec($("#surplus-elec"), data.data.remain, 360);
        var elecChart = echarts.init(document.getElementById('elec-trend'));
        util.sevenElec(elecChart, data.data.recent, trendHeight);
        $(".show-elec").removeClass('loading-data');
        $(".loading").hide();

        if (util.isMobile(navigator.userAgent)) {
            document.getElementById("change-dom").addEventListener("touchstart", function(e) {
                e.preventDefault();

                window.location.href = "index.html";
            });

            // document.getElementById("elec-trend").addEventListener("touchstart", function(e) {
            //     e.preventDefault();
            // });
            document.getElementById('download').addEventListener('touchstart', function(e) {
                e.preventDefault();
                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=net.bingyan.hustpass";
            });
        } else {
            document.getElementById("change-dom").addEventListener("click", function(e) {
                e.preventDefault();

                window.location.href = "index.html";
            });
        }
    });
});
