requirejs.config({
    baseUrl: 'scripts',
    paths: {
        'zepto': 'lib/zepto'
    },
    shim: {
        'zepto': {
            exports: 'Zepto'
        }
    }
});

requirejs(['zepto', 'src/room-util'], function($, util) {
    var mes = {
            loadingFail: "服务器君失联了,请检查一下您的网络",
            findNull: "教室号可能输错了或者是教师休息室T_T"
        },
        roomData;

    $(function() {
        var building = $('.change-build > span').attr('build-id'),
            value;
        util.loadData(building, mes, function(data) {
            roomData = data;
            // console.log(roomData);
        });

        //显示教学楼选项
        $('.change-build > span').tap(function(e) {
            e.preventDefault();
            var options = $('#build-options');
            if (options.css('display') === 'block') {
                options.hide();
            } else {
                options.show();
            }
        });

        //切换教学楼
        $('#build-options').on('touchstart', function(e) {
            $('#build-options li').removeClass('current-build');
            $('.change-build > span').text($(e.target).text());
            $(e.target).addClass('current-tap').addClass('current-build');
        }).on('touchend', function(e) {
            e.preventDefault();
            $(e.target).removeClass('current-tap');
            $(e.currentTarget).hide();
            var build = $(e.target).attr('build-id');
            $('.change-build > span').attr('build-id', build);
            $('.room-main').empty();
            util.loadData(build, mes, function(data) {
                roomData = data;
                // console.log(roomData);
            });
        });

        //获取自习时间段并显示空闲教室
        $('.choose-time').tap(function(e) {
            e.preventDefault();
            var $this = $(e.target),
                $nodes = $('.choose-time span');
            if ($this.attr('time')) {
                if ($this.hasClass('current-time')) {
                    $this.removeClass('current-time');
                    if (parseInt($this.attr('time')) === 0) {
                        $nodes.removeClass('current-time');
                    } else if ($($nodes[0]).hasClass('current-time')) {
                        $($nodes[0]).removeClass('current-time');
                    }
                } else {
                    $this.addClass('current-time');
                    if (parseInt($this.attr('time')) === 0) {
                        $nodes.addClass('current-time');
                    }
                }
                value = util.getPeriod($nodes);
                util.showRoom(value, roomData);
            }
        });

        //显示查询教室界面
        $('#enter-search').tap(function(e) {
            e.preventDefault();
            $('.search-room').addClass('show-search');
        });

        //退出查询教室界面
        $('#back-search').tap(function(e) {
            e.preventDefault();
            $('#user-input').val('');
            $('.room-result').empty();
            $('.search-room').removeClass('show-search');
        });

        //获取并显示查询教室
        $('#get-search').tap(function(e) {
            e.preventDefault();
            var input = $('#user-input').val(),
                build = $('.change-build > span').attr('build-id');
            input = input.toUpperCase();
            util.showSearch(build, input, mes);
        });

        $("#user-input").on('keyup', function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                var input = $('#user-input').val(),
                    build = $('.change-build > span').attr('build-id');
                input = input.toUpperCase();
                util.showSearch(build, input, mes);
            }
        });
    });
});
