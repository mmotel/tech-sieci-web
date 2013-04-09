$(function () { 
	var calcDivDepth = function (root) {
        var children = $(root).children();
        var divDepth = 0;
        while (children.length > 0) {
			if($(children).filter('div').length > 0){ divDepth += 1; }
            children = children.contents();
        }
		return divDepth;
	};
	
	var colorDiv = function(root){
		var size = calcDivDepth(root);
		var children = $(root).children();
		while (children.length > 0) {
			if($(children).filter('div').length > 0){ 
				$(children).filter('div').css('border', size + 'px solid red');
				size -= 1;
			}
            children = children.contents();	
        }
    };
	
	colorDiv($(document.documentElement));
});