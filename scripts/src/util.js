define(['zepto'], function($) {
    //统计点击次数
    function count(srcUrl) {
    	var script = document.createElement('script');
    	script.onload = function() {
    		window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=net.bingyan.hustpass';
    	};
    	script.src = srcUrl;
    	script.language = "JavaScript";
    	$('body').append(script);
    }

    return {
        count: count
    };
});
