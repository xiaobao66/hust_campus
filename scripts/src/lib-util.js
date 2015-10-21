define(['zepto'], function($) {
    //加载热门书籍
    function hotBook(data, parentNode) {
        var fragment = document.createDocumentFragment(),
            title, id, item;
        for (var i = 0; i < data.length; i++) {
            title = data[i].title;
            id = data[i].id;
            item = $(document.createElement('span'));
            item.text(title);
            item.attr('book-id', id);
            $(fragment).append(item);
        }
        parentNode.append(fragment);
    }

    //编码链接
    function encodeURL(url, search) {
        var string = '';
        for (var i in search) {
            string += i + '=' + search[i] + '&';
        }
        string = string.slice(0, -1);
        return url + '?' + encodeURIComponent(string);
    }

    // <div class="book-item">
    //     <div class="thumb-window">
    //         <img class="detail-img" src="http://202.114.9.17/bibimage/zycover.php?isbn=9787121041143">
    //     </div>
    //     <div>
    //         <p class="book-title">C/C++高效率教程asdfasdfdsfsdfadasdsafas</p>
    //         <p class="book-author">李春庚编著</p>
    //     </div>
    // </div>

    //加载搜索结果
    function loadResult(data, parent) {
        var fragment = document.createDocumentFragment(),
            pic, title, author, id, item, img;
        for (var i = 0; i < data.length; i++) {
            item = $(document.createElement('div'));
            item.addClass('book-item');
            $(fragment).append(item);
            pic = $(document.createElement('div'));
            pic.addClass('thumb-window');
            item.append(pic);
            img = $(document.createElement('img'));
            img.addClass('detail-img');
            img.attr('src', data[i].picture);
            pic.append(img);
            pic = $(document.createElement('div'));
            title = $(document.createElement('p'));
            title.addClass('book-title');
            title.text(data[i].title);
            pic.append(title);
            item.append(pic);
            author = $(document.createElement('p'));
            author.addClass('book-author');
            author.text(data[i].author);
            pic.append(author);
            item.append(pic);
            item.attr('book-id', data[i].id);
        }
        parent.append(fragment);
    }

    // <tr>
    //  <th>馆藏地址</th>
    //  <th>索书号</th>
    //  <th>馆藏状态</th>
    // </tr>
    // <tr>
    //  <td>中文图书阅览室（C区2楼，3楼，5楼）</td>
    //  <td>TP312C 848/3</td>
    //  <td>馆内阅览</td>
    // </tr>

    //加载图书详情
    function loadDetail(data, nodes, callback) {
        nodes.name.text(data.title);
        nodes.author.text(data.author);
        nodes.isbn.text(data.isbn);
        nodes.publisher.text(data.publisher);
        if (data.collections.length) {
            var fragment = document.createDocumentFragment(),
                collections = data.collections,
                tr, td;
            for (var i = 0; i < collections.length; i++) {
                tr = document.createElement('tr');
                td = document.createElement('td');
                $(td).text(collections[i].place);
                $(tr).append(td);
                td = document.createElement('td');
                $(td).text(collections[i].index);
                $(tr).append(td);
                td = document.createElement('td');
                $(td).text(collections[i].status);
                $(tr).append(td);
                $(fragment).append(tr);
            }
            nodes.parent.append(fragment);
        } else {
            var div = document.createElement('div');
            $(div).addClass('detail-info');
            $(div).text(data.description);
            nodes.main.append(div);
        }
        nodes.img.onload = function() {
            callback();
        };
        nodes.img.src = data.picture;
    }

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

    return {
        loadHotBook: hotBook,
        encodeURL: encodeURL,
        showErr: showErr,
        loadResult: loadResult,
        loadDetail: loadDetail
    };
});
