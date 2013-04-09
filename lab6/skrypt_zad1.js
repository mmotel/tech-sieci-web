$(function () { 
	 var calcDepth = function (root) {
        var children = $(root).children();
        var depth = 0;

        while (children.length > 0) {
            children = children.contents();
            depth += 1;
        }

        return depth;

    };
	alert(calcDepth($(document.documentElement)));
});