define(function(require, exports, module) {
    var util = require('./util'),
        mes = {
            areaOrigin: "请选择区域,如:东区",
            areaEmpty: "区域选择不能为空",
            buildOrigin: "请输入楼栋号,如:13",
            buildEmpty: "楼栋输入不能为空",
            buildNaN: "楼栋输入只能是数字",
            roomOrigin: "请输入房间号,如:212",
            roomEmpty: "寝室输入不能为空",
            roomNaN: "寝室输入只能是数字",
            loadingFail: "服务器君失联了,请检查一下您的网络",
            inputErr: "输入错误,请检查一下您的输入"
        },
        formData = {};

    // var test = {
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

    //发送表单
    function setForm() {
        var loading = $(".loading");
        var loadInfo = $("#loading-info");
        $.ajax({
            url: "/dianfei",
            type: "GET",
            data: formData,
            contentType: false,
            beforeSend: function() {
                loading.show();
            },
            error: function() {
                util.showErr(mes.loadingFail);
            },
            success: function(data) {
                if (data.code !== 200) {
                    util.showErr(mes.inputErr);
                } else {
                    data = JSON.stringify(data);
                    window.location.href = "show.html?data=" + encodeURIComponent(data);
                    // var average = util.averageElec(util.totalElec(data.data.recent), 7);
                    // $("#aver-number").text(average);
                    // $("#surplus-number").text(data.data.remain);
                    // util.surplusElec($("#surplus-elec"), data.data.remain, 360);
                    // var elecChart = echarts.init(document.getElementById('elec-trend'));
                    // util.sevenElec(elecChart, data.data.recent);
                    // $(".show-elec").removeClass('backTo');
                    // $(".loading").hide();
                }
            }
        });
    }

    $(function() {
        var area, build, room,
            areaOption = $("#area"),
            buildOption = $("input[name='build']"),
            roomOption = $("input[name='room']");

        $(".loading").height($(window).height());

        if (util.isMobile(navigator.userAgent)) {
            document.getElementById('area').addEventListener('touchstart', function() {
                if ($(this).hasClass("error-input")) {
                    $(this).removeClass("error-input");
                    $(this).text(mes.areaOrigin);
                }
                $(this).addClass('origin-input');
                var domArea = $("#dom-area"),
                    areaItem = $("#dom-area li");

                areaItem.removeClass("user-choose");
                if (domArea.is(":hidden")) {
                    domArea.show();
                } else {
                    domArea.hide();
                }
            });

            document.getElementById('dom-area').addEventListener('touchstart', function(e) {
                $(e.target).addClass('user-choose');
            });

            document.getElementById('dom-area').addEventListener('touchend', function(e) {
                e.preventDefault();
                var value = $(e.target).attr("value");
                areaOption.text(value);
                areaOption.removeClass('origin-input');
                areaOption.addClass('correct-input');
                $(this).hide();
            });

            document.getElementById('build').addEventListener('touchstart', function() {
                if ($(this).hasClass("error-input")) {
                    $(this).removeClass("error-input");
                }
                $(this).attr("placeholder", mes.buildOrigin);
            });

            document.getElementById('room').addEventListener('touchstart', function() {
                if ($(this).hasClass("error-input")) {
                    $(this).removeClass("error-input");
                }
                $(this).attr("placeholder", mes.roomOrigin);
            });

            document.getElementById('submit-button').addEventListener('touchstart', function(e) {
                e.preventDefault();
                var inputObj = {
                    areaOption: areaOption,
                    buildOption: buildOption,
                    roomOption: roomOption,
                    mes: mes,
                    formData: formData
                };

                if (util.totalTest(areaOption.text(), buildOption.val(), roomOption.val(), inputObj)) {
                    setForm();
                }
            });
        } else {
            document.getElementById('area').addEventListener('click', function() {
                if ($(this).hasClass("error-input")) {
                    $(this).removeClass("error-input");
                    $(this).text(mes.areaOrigin);
                }
                $(this).addClass('origin-input');
                var domArea = $("#dom-area"),
                    areaItem = $("#dom-area li");

                areaItem.removeClass("user-choose");
                if (domArea.is(":hidden")) {
                    domArea.show();
                } else {
                    domArea.hide();
                }
            });

            document.getElementById('dom-area').addEventListener('mouseover', function(e) {
                $("#dom-area li").removeClass("user-choose");
                $(e.target).addClass('user-choose');
            });

            document.getElementById('dom-area').addEventListener('click', function(e) {
                e.preventDefault();
                var value = $(e.target).attr("value");
                areaOption.text(value);
                areaOption.removeClass('origin-input');
                areaOption.addClass('correct-input');
                $(this).hide();
            });

            document.getElementById('build').addEventListener('click', function() {
                if ($(this).hasClass("error-input")) {
                    $(this).removeClass("error-input");
                }
                $(this).attr("placeholder", mes.buildOrigin);
            });

            document.getElementById('room').addEventListener('click', function() {
                if ($(this).hasClass("error-input")) {
                    $(this).removeClass("error-input");
                }
                $(this).attr("placeholder", mes.roomOrigin);
            });

            document.getElementById('submit-button').addEventListener('click', function(e) {
                e.preventDefault();
                var inputObj = {
                    areaOption: areaOption,
                    buildOption: buildOption,
                    roomOption: roomOption,
                    mes: mes,
                    formData: formData
                };

                if (util.totalTest(areaOption.text(), buildOption.val(), roomOption.val(), inputObj)) {
                    setForm();
                }
            });
        }

        //测试电量显示结果
        // var average = util.averageElec(util.totalElec(test.data.recent), 7);
        // $("#aver-number").text(average);
        // $("#surplus-number").text(test.data.remain);
        // util.surplusElec($("#surplus-elec"), test.data.remain, 360);
        // var elecChart = echarts.init(document.getElementById('elec-trend'));
        // util.sevenElec(elecChart, test.data.recent);
    });
});
