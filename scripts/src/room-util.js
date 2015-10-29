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
        var values = [0, 0, 0, 0];
        for (var i = 0; i < nodes.length; i++) {
            if ($(nodes[i]).hasClass('current-time')) {
                switch (i) {
                    case 0:
                        values[0] += 1;
                        break;
                    case 1:
                        values[1] += 1;
                        break;
                    case 2:
                        values[1] += 2;
                        break;
                    case 3:
                        values[2] += 1;
                        break;
                    case 4:
                        values[2] += 2;
                        break;
                    case 5:
                        values[3] += 1;
                }
            }
        }
        if (values.toString() === '0,3,3,1') {
            nodes.addClass('current-time');
            values[0] = 1;
        }
        // console.log(values);
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
                // $('.no-choice').hide();
                $('.choose-time span').removeClass('current-time');
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

    // <section class="build-item">
    //     <div>1楼</div>
    //     <div>
    //         <span>N101</span>
    //         <span>N101</span>
    //     </div>
    //     <div></div>
    // </section>

    //显示空闲教室
    function showRoom(value, data) {
        // console.log(data);
        $(".loading").show();
        $('.load-origin').show();
        $('.room-main').empty();
        var rooms = getNeededRoom(data, value),
            fragment = document.createDocumentFragment(),
            item, div, span;
        for (var i in rooms) {
            if (rooms[i].length) {
                item = $(document.createElement('section'));
                item.addClass('build-item');
                div = $(document.createElement('div'));
                div.text(i + '楼').appendTo(item);
                div = $(document.createElement('div'));
                for (var j = 0; j < rooms[i].length; j++) {
                    span = $(document.createElement('span'));
                    span.text(rooms[i][j]).appendTo(div);
                }
                div.appendTo(item);
                div = document.createElement('div');
                item.append(div).appendTo(fragment);
            }
        }
        $('.room-main').append(fragment);
        if (value.toString() !== '0,0,0,0') {
            $('.no-choice').hide();
        } else {
            $('.no-choice').show();
        }
        $(".loading").hide();
        $('.load-origin').hide();
    }

    //获取需要显示的教室
    function getNeededRoom(data, opts) {
        var rooms = [
                [],
                [],
                [],
                []
            ],
            temp, needed = [],
            str = /^[a-zA-Z]$/;
        for (var i = 0; i < opts.length; i++) {
            if ((temp = getSpecifiedRoom(data, i, opts[i]))) {
                rooms[i] = temp.split(" ");
            }
            if (i === 0 && opts[0] === 1) {
                break;
            }
        }
        // console.log(rooms);
        if (rooms[0].length) {
            needed = rooms[0];
        } else {
            for (i = 1; i < rooms.length; i++) {
                if (rooms[i].length) {
                    if (!needed.length) {
                        needed = rooms[i];
                    } else {
                        needed = getArraySameElem(needed, rooms[i]);
                    }
                }
            }
        }
        //教室分层
        temp = needed;
        needed = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: []
        };
        for (i = 0; i < temp.length; i++) {
            if (str.test(temp[i][0])) {
                needed[temp[i][1]].push(temp[i]);
            } else {
                needed[temp[i][0]].push(temp[i]);
            }
        }
        return needed;
    }

    //获取两个数组相同的元素
    function getArraySameElem(arr1, arr2) {
        var sameArr = [];
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                if (arr1[i] === arr2[j]) {
                    sameArr.push(arr1[i]);
                    break;
                }
            }
        }
        return sameArr;
    }

    //获取指定时间段空闲教室
    function getSpecifiedRoom(data, flag, opts) {
        var rooms;
        switch (flag) {
            case 0:
                if (opts === 1) {
                    rooms = data.WHOLE.whole;
                }
                break;
            case 1:
                switch (opts) {
                    case 1:
                        rooms = data.AM.partA;
                        break;
                    case 2:
                        rooms = data.AM.partB;
                        break;
                    case 3:
                        rooms = (getArraySameElem(data.AM.partA.split(" "), data.AM.partB.split(" "))).join(" ");
                }
                break;
            case 2:
                switch (opts) {
                    case 1:
                        rooms = data.PM.partA;
                        break;
                    case 2:
                        rooms = data.PM.partB;
                        break;
                    case 3:
                        rooms = (getArraySameElem(data.PM.partA.split(" "), data.PM.partB.split(" "))).join(" ");
                }
                break;
            case 3:
                if (opts === 1) {
                    rooms = data.NIG.whole;
                }
        }
        return rooms;
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

    //获取当前第几节课时间
    function getNow() {
        var date = new Date(),
            month = date.getMonth() + 1,
            hours = date.getHours(),
            mins = date.getMinutes(),
            time = 0,
            flag = 1,
            value = [0, 0, 0, 0];
        time = hours + mins / 60;
        if (month >= 5 && month <= 9) {
            flag = 0;
        }
        if (time < 9.67) {
            value[1] = 1;
        } else if (time < 11.84) {
            value[1] = 2;
        } else {
            if (flag) {
                if (time < 15.59) {
                    value[2] = 1;
                } else if (time < 17.5) {
                    value[2] = 2;
                } else {
                    value[3] = 1;
                }
            } else {
                if (time < 16.09) {
                    value[2] = 1;
                } else if (time < 18.00) {
                    value[2] = 2;
                } else {
                    value[3] = 1;
                }
            }
        }
        return value;
    }

    //修正查询结果
    function correctSearch(build, room) {
        var str = /^[a-zA-Z]$/,
            temp = "";
        correctRoom = [];
        room = room.split(' ');
        for (var i = 0; i < room.length; i++) {
            if (str.test(room[i][0])) {
                temp = room[i].substring(1);
            } else {
                temp = room[i];
            }
            if (build === 'X12') {
                correctRoom.push('N' + temp);
                correctRoom.push('S' + temp);
            } else if (build === 'D9') {
                correctRoom.push('A' + temp);
                correctRoom.push('B' + temp);
                correctRoom.push('C' + temp);
                correctRoom.push('D' + temp);
            }
        }
        return correctRoom;
    }

    //获取查询教室结果
    function showSearch(build, room, mes) {
        var date = getTime(),
            building;
        if (build === 'X12' || build === 'D9') {
            room = correctSearch(build, room);
            room = room.join(';');
        } else {
            room = room.replace(new RegExp(/( )/g), ";");
        }
        switch (build) {
            case 'X12':
                building = '西十二';
                break;
            case 'X5':
                building = '西五';
                break;
            case 'D5':
                building = '东五';
                break;
            case 'D9':
                building = '东九';
                break;
            case 'D12':
                building = '东十二';
        }
        // console.log(room);
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
                    loadSearch(data.data, building);
                    $('.loading').hide();
                    $('.loading-origin').hide();
                }
            }
        });
    }

    // <div class="result-item">
    //     <h3>201</h3>
    //     <div class="table">
    //         <div class="table-row">
    //             <div class="table-cell info-title">空闲时间:</div>
    //             <div class="table-cell info-show">
    //                 <span>1-2节</span>
    //                 <span>3-4节</span>
    //                 <span>5-6节</span>
    //                 <span>7-8节</span>
    //                 <span>9-12节</span>
    //             </div>
    //         </div>
    //         <div class="table-row">
    //             <div class="table-cell info-title">占用时间:</div>
    //             <div class="table-cell info-show">
    //                 <div class="table-row">
    //                     <div class="table-cell class-info">1-2节</div>
    //                     <div class="table-cell">计算机学院</div>
    //                 </div>
    //                 <div class="table-row">
    //                     <div class="table-cell class-info">9-12节</div>
    //                     <div class="table-cell">计算机学院</div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // </div>

    // <h2>东九</h2>
    // <div class="result-item">
    //     <h3>A201</h3>
    //     <div class="table">
    //         <div class="table-row">
    //             <div class="table-cell info-title">空闲时间:</div>
    //             <div class="table-cell info-show">
    //                 <span>1-2节</span>
    //                 <span>3-4节</span>
    //                 <span>5-6节</span>
    //                 <span>7-8节</span>
    //                 <span>9-12节</span>
    //             </div>
    //         </div>
    //     </div>
    // </div>

    //显示查询到的教室
    function loadSearch(data, build) {
        var fragment, h2, item, h3, table, row, cell, span, row2, cell2;
        // console.log(data);
        h2 = $(document.createElement('h2'));
        h2.text(build).appendTo($('.room-result'));
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
            // row = $(document.createElement('div'));
            // row.addClass('table-row');
            // cell = $(document.createElement('div'));
            // cell.addClass('table-cell info-title').text('占用时间:').appendTo(row);
            // cell = $(document.createElement('div'));
            // cell.addClass('table-cell info-show');
            // for (var z in data[i]) {
            //     if (data[i][z] !== "") {
            //         row2 = $(document.createElement('div'));
            //         row2.addClass('table-row');
            //         cell2 = $(document.createElement('div'));
            //         cell2.addClass('table-cell class-info');
            //         switch (z) {
            //             case 'A':
            //                 cell2.text('1-2节').appendTo(row2);
            //                 cell2 = $(document.createElement('div'));
            //                 cell2.addClass('table-cell');
            //                 cell2.text(data[i][z]).appendTo(row2);
            //                 break;
            //             case 'B':
            //                 cell2.text('3-4节').appendTo(row2);
            //                 cell2 = $(document.createElement('div'));
            //                 cell2.addClass('table-cell');
            //                 cell2.text(data[i][z]).appendTo(row2);
            //                 break;
            //             case 'C':
            //                 cell2.text('5-6节').appendTo(row2);
            //                 cell2 = $(document.createElement('div'));
            //                 cell2.addClass('table-cell');
            //                 cell2.text(data[i][z]).appendTo(row2);
            //                 break;
            //             case 'D':
            //                 cell2.text('7-8节').appendTo(row2);
            //                 cell2 = $(document.createElement('div'));
            //                 cell2.addClass('table-cell');
            //                 cell2.text(data[i][z]).appendTo(row2);
            //                 break;
            //             case 'E':
            //                 cell2.text('9-12节').appendTo(row2);
            //                 cell2 = $(document.createElement('div'));
            //                 cell2.addClass('table-cell');
            //                 cell2.text(data[i][z]).appendTo(row2);
            //                 break;
            //         }
            //         row2.appendTo(cell);
            //     }
            // }
            // cell.appendTo(row);
            // row.appendTo(table);
            table.appendTo(item);
            $(fragment).append(item).appendTo($('.room-result'));
        }
    }

    return {
        showErr: showErr,
        getPeriod: getPeriod,
        loadData: loadData,
        showRoom: showRoom,
        showSearch: showSearch,
        getNow: getNow
    };
});
