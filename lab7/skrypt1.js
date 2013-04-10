$(function () {
	var getColour = function (i) { // "brzydkie" i mało eleganckie rozwiązanie 
		var color;
		if(i === 1) { color = '#bbbbbb'; }
		else if(i === 2) { color = '#cccccc'; }
		else if(i === 3) { color = '#dddddd'; }
		else if(i === 4) { color = '#eeeeee'; }
		else { color = '#ffffff'; }
		return color;
	};
	
	var children = $(document.documentElement).children();
	while(children.length > 0){
		children.each( function() {
			$(this).click(function () { 
				var i = 1;
				$(this).css('background', '#aaaaaa');
				var parent = $(this).parent();
				while($(parent).length > 0){					
					parent.css('background', getColour(i));
					parent = $(parent).parent();
					i++;
				}
				var that = $(this);
				setTimeout(function() {
					$(that).css('background','#ffffff');
					parent = $(that).parent();
					while($(parent).length > 0){
						parent.css('background', '#ffffff');
						parent = $(parent).parent();
					}	
				} ,1000);
				return false;
			});
		});
		children = $(children).children();
	}
});