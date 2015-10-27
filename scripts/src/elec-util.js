define(['zepto', 'echarts'], function($, echarts) {
    var Util = function() {

        },
        util = new Util();

    //检测用户输入是否为空
    Util.prototype.isNull = function(value) {
        if (value === "") {
            return true;
        } else {
            return false;
        }
    };

    //计算日均用电量
    Util.prototype.averageElec = function(data) {
        var total = Math.abs(data.total),
            average = 0;

        if (total !== 0) {
            average = (total / data.day).toFixed(1);
        }

        return average;
    };

    //获取总的用电量
    Util.prototype.totalElec = function(recent) {
        var total = 0,
            lastElec = 0,
            nowElec = 0,
            gap = 0,
            day = 0,
            j = 1;

        for (var i in recent) {
            nowElec = parseFloat(recent[i].dianfei);
            if (j !== 1) {
                gap = lastElec - nowElec;

                if (gap > 0) {
                    total += gap;
                    day++;
                }
            }
            lastElec = nowElec;
            j++;
        }

        return {
            total: total,
            day: day
        };
    };

    //绘制剩余电量百分比
    Util.prototype.surplusElec = function(parent, remain, total) {
        var canvas = document.createElement('canvas'),
            x = parent.width() / 2,
            y = parent.height() / 2,
            radius = parent.width() / 2 - 4.5;

        canvas.width = parent.width();
        canvas.height = parent.height();
        var ctx = canvas.getContext("2d");
        eAngle = (remain / total).toFixed(1) * Math.PI * 2 + 1.5 * Math.PI;
        ctx.strokeStyle = "#1fe0a7";
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.arc(x, y, radius, 1.5 * Math.PI, eAngle, false);
        ctx.stroke();
        parent.prepend(canvas);
        console.log(parent.width(),parent.height());
    };

    //日期横坐标转换
    Util.prototype.translateDate = function(date) {
        var day = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            mDay, mMonth, mDate;

        mDay = day[date.getDay()];
        mMonth = date.getMonth() + 1;
        mDate = date.getDate();

        return mDay + "<br>" + mMonth + "月" + mDate + "日";
    };

    //显示表单发送错误信息
    Util.prototype.showErr = function (err) {
        $('.load-origin').hide();
        $('.load-info > p').text(err);
        $('.load-info').show();
        setTimeout(function() {
            $('.load-info').hide();
            $('.loading').hide();
        }, 2000);
    };

    //绘制7天用电趋势
    Util.prototype.sevenElec = function(charts, data, chartsHeight) {
        var date, sdate, year, month, day, xAxisD = [],
            elecData = [];
        //分割日期及获取电量
        for (var i in data) {
            year = parseInt(i.slice(0, 4));
            month = parseInt(i.slice(4, 6)) - 1;
            day = parseInt(i.slice(6, 8)) - 1;
            date = new Date(year, month, day);
            sdate = util.translateDate(date);
            xAxisD.push(sdate);
            elecData.push(data[i].dianfei);
        }

        var option = {
            grid: {
                borderWidth: 0,
                x: 0,
                y: 100,
                x2: 0,
                y2: 0
            },
            tooltip: {
                trigger: 'axis',
                showContent: true,
                backgroundColor: '#47deec',
                borderColor: '#fff',
                borderRadius: 40,
                borderWidth: 1,
                textStyle: {
                    color: '#fff',
                    decoration: 'none',
                    align: 'center',
                    fontFamily: 'sans-serif',
                    fontSize: 12,
                    padding: 15
                },
                axisPointer: {
                    type: "none"
                },
                position: function(p) {
                    var x;
                    if (p[0] > $(window).width() - 10) {
                        x = p[0] + 30;
                    } else if (p[0] < 20) {
                        x = 0;
                    } else {
                        x = p[0] - 50;
                    }
                    return [x, 20];
                },
                formatter: function(params, ticket, callback) {
                    // var mes = params[0].name + "<br>" + "<span style='font-size: 15px'>" + params[0].data + "</span>" + "<br>kw-h";
                    var mes = "<div style='text-align: center;width:70px;height:70px'>" + params[0].name + "<br>" +
                        "<span style='font-size: 16px'>" + params[0].data + "</span>" + "<br>kw-h" +
                        "</div>";
                    return mes;
                }
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                show: false,
                data: xAxisD,
                boundaryGap: false
            }],
            yAxis: [{
                type: 'value',
                show: false
            }],
            series: [{
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: "#47deec",
                        areaStyle: {
                            type: 'default',
                            color: '#47deec'
                        },
                        lineStyle: {
                            color: '#47deec'
                        }
                    },
                    emphasis: {
                        borderColor: "#fff",
                        borderWidth: 2
                    }
                },
                symbolSize: 5,
                showAllSymbol: true,
                data: elecData
            }]
        };


        charts.setOption(option);
    };

    //用户输入综合检测
    Util.prototype.totalTest = function(area, build, room, inputObj) {
        var flag = true,
            areaOption = inputObj.areaOption,
            buildOption = inputObj.buildOption,
            roomOption = inputObj.roomOption,
            mes = inputObj.mes,
            formData = inputObj.formData;

        if (area === mes.areaOrigin) {
            areaOption.text(mes.areaEmpty);
            areaOption.removeClass('origin-input');
            areaOption.addClass('error-input');
            flag = false;
        } else {
            formData.area = area;
        }

        if (util.isNull(build)) {
            buildOption.attr("placeholder", mes.buildEmpty);
            buildOption.addClass('error-input');
            flag = false;
        } else if (isNaN(build)) {
            buildOption.val("");
            buildOption.attr("placeholder", mes.buildNaN);
            buildOption.addClass('error-input');
            flag = false;
        } else {
            formData.build = build;
        }

        if (util.isNull(room)) {
            roomOption.attr("placeholder", mes.roomEmpty);
            roomOption.addClass('error-input');
            flag = false;
        } else if (isNaN(room)) {
            roomOption.val("");
            roomOption.attr("placeholder", mes.roomNaN);
            roomOption.addClass('error-input');
            flag = false;
        } else {
            formData.room = room;
        }

        return flag;
    };

    //检测访问时是pc端还是移动端
    Util.prototype.isMobile = function(userAgent) {
        if (/AppleWebKit.*Mobile/i.test(userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(userAgent))) {
            return true;
        } else {
            return false;
        }
    };

    return {
        util: util
    };
});
