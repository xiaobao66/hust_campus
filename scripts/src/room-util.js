define(['zepto'], function($) {
    //显示错误信息
    function showErr(err) {
        $('.load-origin').hide();
        $('.load-info > p').text(err);
        $('.load-info').show();
        setTimeout(function() {
            $('.load-info').hide();
            $('.loading').hide();
        }, 2000);
    }

    //获取具体的时间段
    function getPeriod(nodes) {
        var values = 0;
        for (var i = 0; i < nodes.length; i++) {
            if ($(nodes[i]).hasClass('current-time')) {
                values += parseInt($(nodes[i]).attr('time'));
            }
        }
        if (values === 15) {
            nodes.addClass('current-time');
        }
        return values;
    }

    function loadData(building, mes, callback) {
        var date = getTime();
        $.ajax({
            url: '/classroom',
            type: 'GET',
            data: {
                date: date,
                build: building,
                period: 'ALL'
            },
            beforeSend: function() {
                $('.no-choice').hide();
                $(".loading").show();
                $('.load-origin').show();
            },
            error: function() {
                showErr(mes.loadingFail);
            },
            success: function(data) {
                $('.loading').hide();
                $('.loading-origin').hide();
                $('.no-choice').show();
                callback(data.data);
            }
        });
    }

    //显示空闲教室
    function showRoom(value, data) {

    }

    //获取当前日期
    function getTime() {
        var myDate = new Date(),
            year = myDate.getFullYear(),
            month = myDate.getMonth() + 1,
            day = myDate.getDate(),
            time = year + '' + month + day;
        return time;
    }

    //获取查询教室结果
    function showSearch(build, room, mes) {
        var date = getTime();
        room = room.replace(new RegExp(/( )/g), ";");
        $.ajax({
            url: '/classroom',
            type: 'GET',
            data: {
                date: date,
                build: build,
                room: room
            },
            beforeSend: function() {
                $(".loading").show();
                $('.load-origin').show();
            },
            error: function() {
                showErr(mes.loadingFail);
            },
            success: function(data) {
                console.log(data);
                if (data.code !== 200) {
                    showErr(mes.findNull);
                } else {
                    //显示查询到的教室
                    $('.room-result').empty();
                    loadSearch(data.data);
                    $('.loading').hide();
                    $('.loading-origin').hide();
                }
            }
        });
    }

    //显示查询到的教室
    function loadSearch(data) {
        var fragment,item, h3, info, span, div, p, span2;
        for (var i in data) {
            fragment = document.createDocumentFragment();
            item = $(document.createElement('div'));
            item.addClass('result-item');
            h3 = $(document.createElement('h3'));
            h3.text(i);
            item.append(h3);
            info = $(document.createElement('div'));
            info.addClass('info-item');
            span = $(document.createElement('span'));
            span.text('空闲时间:');
            info.append(span);
            div = $(document.createElement('div'));
            for (var j in data[i]) {
                span = $(document.createElement('span'));
                if (data[i][j] === "") {
                    switch (j) {
                        case 'A':
                            span.text('1-2节');
                            div.append(span);
                            break;
                        case 'B':
                            span.text('3-4节');
                            div.append(span);
                            break;
                        case 'C':
                            span.text('5-6节');
                            div.append(span);
                            break;
                        case 'D':
                            span.text('7-8节');
                            div.append(span);
                            break;
                        case 'E':
                            span.text('9-12节');
                            div.append(span);
                            break;
                    }
                }
            }
            info.append(div);
            item.append(info);
            info = $(document.createElement('div'));
            info.addClass('info-item');
            span = $(document.createElement('span'));
            span.text('占用时间:');
            info.append(span);
            div = $(document.createElement('div'));
            for (var z in data[i]) {
                p = $(document.createElement('p'));
                span = $(document.createElement('span'));
                if (data[i][z] !== "") {
                    switch (z) {
                        case 'A':
                            span.text('1-2节');
                            p.append(span);
                            span = $(document.createElement('span'));
                            span.text(data[i][z]);
                            p.append(span);
                            div.append(p);
                            break;
                        case 'B':
                            span.text('3-4节');
                            p.append(span);
                            span = $(document.createElement('span'));
                            span.text(data[i][z]);
                            p.append(span);
                            div.append(p);
                            break;
                        case 'C':
                            span.text('5-6节');
                            p.append(span);
                            span = $(document.createElement('span'));
                            span.text(data[i][z]);
                            p.append(span);
                            div.append(p);
                            break;
                        case 'D':
                            span.text('7-8节');
                            p.append(span);
                            span = $(document.createElement('span'));
                            span.text(data[i][z]);
                            p.append(span);
                            div.append(p);
                            break;
                        case 'E':
                            span.text('9-12节');
                            p.append(span);
                            span = $(document.createElement('span'));
                            span.text(data[i][z]);
                            p.append(span);
                            div.append(p);
                            break;
                    }
                }
            }
            info.append(div);
            item.append(info);
            $(fragment).append(item);
            $(".room-result").append(fragment);
        }
    }

    return {
        showErr: showErr,
        getPeriod: getPeriod,
        loadData: loadData,
        showRoom: showRoom,
        showSearch: showSearch
    };
});
