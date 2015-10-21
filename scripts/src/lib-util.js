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
            string += i + '=' + search[i];
        }
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
        loadResult: loadResult
    };
});
