$(function () {
	//drukowanie interfejsu
	var drawGUI = function(size){
		$('body').append('<div id="history"></div>');
		$('body').append('<div id="move"></div>');
		
		for(var i=0; i < size; i++){
			$('div#move').append('<input type="text" id="' + i + '"></input>');
		};
		
		$('div#move').append('<button id="checkMarks">Sprawdź</button>');
		//sprawdzanie rozwiązania
		$('button#checkMarks').click( function(){
		
			var path = 'http://localhost:3000/mark/';
			var toAppend = '<div><table><tr>';
			var inputs = $('div#move').children().filter('input[type="text"]');
			
			for(i=0; i < inputs.length; i++){
				path += $(inputs[i]).val() + '/';
				toAppend += '<td>' + $(inputs[i]).val() + '</td>';
				$(inputs[i]).val('');
			};
			
			$.getJSON(path, function(data){
				console.log(data.blackPoints + ' : ' + data.whitePoints);
				toAppend += '<td>';
				for(var i=0; i < data.blackPoints; i++){
					toAppend += '#';
				};
				for(var i=0; i < data.whitePoints; i++){
					toAppend += '*';
				};
				toAppend += '</td></tr></table></div>';
				$('div#history').append(toAppend);
				
			});
		});
	};
	//przygotowanie interfejsu
    $('body').append('<button id="startGame">Zagraj</button>');
	$('body').append('<div id="output"></div>');
	
	//rozpoczęcie gry
	$('button#startGame').click(function(){
		
		$.getJSON("http://localhost:3000/play/",
		function (data) {
                $('div#output').append('<p> Rozmiar: ' + data.size + '<br/> Ilość kolorów: ' + data.dim + '  </p>');
				drawGUI(data.size);
            });
	
		$('button#startGame').css('display', 'none');
	});
});
