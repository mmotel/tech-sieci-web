$(function() {
	var cenzura = function (patt){
		var pattern = new RegExp(patt, 'g');
		var children = $('body').contents();
		while(children.length > 0){
			for(var i=0; i < $(children).length; i+=1){
				if(children[i].nodeType === 3){
					var m = children[i].data.match(pattern);
					if(m){
						children[i].data = children[i].data.replace(pattern, 'CENZURA');
						$(children[i]).parent().css('background', 'red');
					}
				}
			}
            children = $(children).contents();
        }
	};
	cenzura('treść');
});