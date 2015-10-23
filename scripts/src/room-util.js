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
        var fragment, item, h3, table, row, cell, span, row2, cell2;
        for (var i in data) {
            fragment = document.createDocumentFragment();
            item = $(document.createElement('div'));
            item.addClass('result-item');
            h3 = $(document.createElement('h3'));
            h3.text(i).appendTo(item);
            table = $(document.createElement('div'));
            table.addClass('table');
            row = $(document.createElement('div'));
            row.addClass('table-row');
            cell = $(document.createElement('div'));
            cell.addClass('table-cell info-title').text('空闲时间:').appendTo(row);
            cell = $(document.createElement('div'));
            cell.addClass('table-cell info-show');
            for (var j in data[i]) {
                span = $(document.createElement('span'));
                if (data[i][j] === "") {
                    switch (j) {
                        case 'A':
                            span.text('1-2节').appendTo(cell);
                            break;
                        case 'B':
                            span.text('3-4节').appendTo(cell);
                            break;
                        case 'C':
                            span.text('5-6节').appendTo(cell);
                            break;
                        case 'D':
                            span.text('7-8节').appendTo(cell);
                            break;
                        case 'E':
                            span.text('9-12节').appendTo(cell);
                            break;
                    }
                }
            }
            cell.appendTo(row);
            row.appendTo(table);
            row = $(document.createElement('div'));
            row.addClass('table-row');
            cell = $(document.createElement('div'));
            cell.addClass('table-cell info-title').text('占用时间:').appendTo(row);
            cell = $(document.createElement('div'));
            cell.addClass('table-cell info-show');
            for (var z in data[i]) {
                if (data[i][z] !== "") {
                    row2 = $(document.createElement('div'));
                    row2.addClass('table-row');
                    cell2 = $(document.createElement('div'));
                    cell2.addClass('table-cell class-info');
                    switch (z) {
                        case 'A':
                            cell2.text('1-2节').appendTo(row2);
                            cell2 = $(document.createElement('div'));
                            cell2.addClass('table-cell');
                            cell2.text(data[i][z]).appendTo(row2);
                            break;
                        case 'B':
                            cell2.text('3-4节').appendTo(row2);
                            cell2 = $(document.createElement('div'));
                            cell2.addClass('table-cell');
                            cell2.text(data[i][z]).appendTo(row2);
                            break;
                        case 'C':
                            cell2.text('5-6节').appendTo(row2);
                            cell2 = $(document.createElement('div'));
                            cell2.addClass('table-cell');
                            cell2.text(data[i][z]).appendTo(row2);
                            break;
                        case 'D':
                            cell2.text('7-8节').appendTo(row2);
                            cell2 = $(document.createElement('div'));
                            cell2.addClass('table-cell');
                            cell2.text(data[i][z]).appendTo(row2);
                            break;
                        case 'E':
                            cell2.text('9-12节').appendTo(row2);
                            cell2 = $(document.createElement('div'));
                            cell2.addClass('table-cell');
                            cell2.text(data[i][z]).appendTo(row2);
                            break;
                    }
                    row2.appendTo(cell);
                }
            }
            cell.appendTo(row);
            row.appendTo(table);
            table.appendTo(item);
            $(fragment).append(item).appendTo($('.room-result'));
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
