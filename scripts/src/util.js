define(['zepto'], function($) {
    //统计点击次数
    function count(srcUrl) {
    	var script = document.createElement('script');
    	$('body').append(script);
    	script.onload = function(e) {
    		window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=net.bingyan.hustpass';
    		$('body').remove(e.target);
    	};
    	script.src = srcUrl;
    	script.language = "JavaScript";
    }

    return {
        count: count
    };
});
