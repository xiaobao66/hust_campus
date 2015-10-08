define(function(require, exports, module) {
    var util = require('./util'),
        data = window.location.search.split("=")[1];

    data = decodeURIComponent(data);
    data = JSON.parse(data);

    $(function() {
        var average = util.averageElec(util.totalElec(data.data.recent), 7),
            trendHeight = $(window).height() - $("#trend-title").offset().top - 25;

        document.getElementById("change-dom").addEventListener("touchstart", function(e) {
            e.preventDefault();

            window.location.href = "index.html";
        });

        $("#elec-trend").height(trendHeight);
        $("#aver-number").text(average);
        $("#surplus-number").text(data.data.remain);
        util.surplusElec($("#surplus-elec"), data.data.remain, 360);
        var elecChart = echarts.init(document.getElementById('elec-trend'));
        util.sevenElec(elecChart, data.data.recent, trendHeight);
        $(".show-elec").removeClass('loading-data');
        $(".loading").hide();
    });
});
