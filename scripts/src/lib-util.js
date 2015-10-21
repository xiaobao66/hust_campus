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
        showErr: showErr
    };
});
