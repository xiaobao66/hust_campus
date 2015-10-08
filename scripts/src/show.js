define(function(require, exports, module) {
    var util = require('./util'),
        data = window.location.search.split("=")[1];

    data = decodeURIComponent(data);
	data = JSON.parse(data);
});
