$(function () {
	var lighten = function(color, percent) { //funkcja od Macieja Smefju Małeckiego (https://github.com/smt116)
		var R = parseInt(color.substring(1,3),16);
		var G = parseInt(color.substring(3,5),16);
		var B = parseInt(color.substring(5,7),16);

		R = parseInt(R * (100 + percent) / 100);
		G = parseInt(G * (100 + percent) / 100);
		B = parseInt(B * (100 + percent) / 100);

		R = (R<255)?R:255;  
		G = (G<255)?G:255;  
		B = (B<255)?B:255;  

		var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
		var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
		var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

		return '#' + RR + GG + BB;
	}
	
	var children = $(document.documentElement).children();
	while(children.length > 0){
		children.each( function() {
			$(this).click(function () { 
				var i = 1;
				$(this).css('background', '#aaaaaa');
				var parent = $(this).parent();
				while($(parent).length > 0){					
					parent.css('background', lighten('#aaaaaa', i * 10));
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