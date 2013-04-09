$(function () { 
	 var printTextNodes = function (root) {
        var children = $(root).children();
        var depth = 0;
		var text = "";
		while(children.length > 0){
			for(var i =0; i < children.length; i++){
				if(children[i].nodeType === 3){
					text += $.trim(children[i].data) + " ";
				}
			}
            children = $(children).contents();
        }
        return text;
    };
	alert(printTextNodes($(document.documentElement)));
});
