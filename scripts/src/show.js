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

    $(function() {
        var average = util.averageElec(util.totalElec(data.data.recent), 7),
            trendHeight = $(window).height() - $("#trend-title").offset().top - 25,
            remain = data.data.remain;

        document.getElementById("change-dom").addEventListener("touchstart", function(e) {
            e.preventDefault();

            window.location.href = "index.html";
        });

        $("#elec-trend").height(trendHeight);
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
    });
});
