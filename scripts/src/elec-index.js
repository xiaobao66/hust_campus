requirejs.config({
    baseUrl: "scripts",
    paths: {
        'zepto': 'lib/zepto',
        'echarts': 'lib/echarts-all'
    },
    shim: {
        'zepto': {
            exports: 'Zepto'
        },
        'echarts': {
            exports: 'echarts'
        }
    }
});

requirejs(['zepto', 'src/elec-util'], function($, Util) {
    var mes = {
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
        formData = {},
        util = Util.util;
    //发送表单
    function setForm() {
        var loading = $(".loading");
        $.ajax({
            url: "/dianfei",
            type: "GET",
            data: formData,
            contentType: false,
            beforeSend: function() {
                loading.show();
                $('.load-origin').show();
            },
            error: function() {
                util.showErr(mes.loadingFail);
            },
            success: function(data) {
                if (data.code !== 200) {
                    util.showErr(mes.inputErr);
                } else {
                    data = JSON.stringify(data);
                    window.location.href = "elec-show.html?" + Math.random() + "data=" + encodeURIComponent(data);
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

        if (util.isMobile(navigator.userAgent)) {
            document.getElementById('area').addEventListener('touchstart', function() {
                if ($(this).hasClass("error-input")) {
                    $(this).removeClass("error-input");
                    $(this).text(mes.areaOrigin);
                }
                $(this).addClass('origin-input');
                var domArea = $("#dom-area"),
                    areaItem = $("#dom-area li");
                document.getElementById('build').blur();
                document.getElementById('room').blur();

                areaItem.removeClass("user-choose");
                if (domArea.css('display') === "none") {
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
                $(this).attr("placeholder", "");
            });

            document.getElementById('build').addEventListener('blur', function() {
                $(this).attr("placeholder", mes.buildOrigin);
            });

            document.getElementById('room').addEventListener('touchstart', function() {
                if ($(this).hasClass("error-input")) {
                    $(this).removeClass("error-input");
                }
                $(this).attr("placeholder", "");
            });

            document.getElementById('room').addEventListener('blur', function() {
                $(this).attr("placeholder", mes.roomOrigin);
            });

            document.getElementById('room').addEventListener('keyup', function(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    document.getElementById('build').blur();
                    document.getElementById('room').blur();
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
                }
            });

            document.getElementById('submit-button').addEventListener('touchstart', function(e) {
                e.preventDefault();
                document.getElementById('build').blur();
                document.getElementById('room').blur();
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
                document.getElementById('build').blur();
                document.getElementById('room').blur();

                areaItem.removeClass("user-choose");
                if (domArea.css('display') === "none") {
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
                document.getElementById('build').blur();
                document.getElementById('room').blur();
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
    });
});
