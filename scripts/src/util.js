define(['zepto'], function($) {
    //cnzz统计点击次数
    function countCnzz(srcUrl) {
    	var script = document.createElement('script');
    	$('body').append(script);
    	script.onload = function(e) {
    		$(e.target).remove();
    		window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=net.bingyan.hustpass';
    	};
    	script.src = srcUrl;
    	script.language = "JavaScript";
    }

    //baidu统计点击次数
    function countBaidu(srcUrl) {
        var script = document.createElement('script');
        $('head').append(script);
        script.onload = function(e) {
            $(e.target).remove();
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=net.bingyan.hustpass';
        };
        script.src = srcUrl;
    }

    return {
        count: countCnzz
    };
});
