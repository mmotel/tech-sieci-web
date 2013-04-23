$(function () {
	//drukowanie interfejsu
	var drawGUI = function(size){
		$('#move').children().remove();
		$('#history').children().remove();
		$('#output').children().remove();
		
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
				toAppend += '<td class="historyVal">' + $(inputs[i]).val() + '</td>';
				$(inputs[i]).val('');
			};
			
			$.getJSON(path, function(data){
				console.log(data.blackPoints + ' : ' + data.whitePoints);
				for(var i=0; i < data.blackPoints; i++){
					toAppend += '<td><div class="black"></div></td>';
				};
				for(var i=0; i < data.whitePoints; i++){
					toAppend += '<td><div class="white"></div></td>';
				};
				toAppend += '</tr></table></div>';

				//wygrana

				//przekroczenie liczby ruchów
				$('div#history').append(toAppend);
				console.log('over: ' + data.gameOver);
				console.log('win: ' + data.gameWin);
				if(data.gameOver){
					$('button#checkMarks').css('display', 'none');
					$('#panel').css('display', 'block');
					alert('WYKONAŁEŚ MAKSYMALNĄ ILOŚĆ RUCHÓW.');
				} else
				if(data.gameWin){
					$('button#checkMarks').css('display', 'none');
					$('#panel').css('display', 'block');
					alert('WYGRAŁEŚ!');
				}
			});
		});
	};
	//przygotowanie interfejsu
	$('body').append('<div id="panel"></div>');
	$('body').append('<div id="output"></div>');
	$('body').append('<div id="history"></div>');
	$('body').append('<div id="move"></div>');

	$('#panel').append('<div class="selectPanel">rozmiar planszy: <input type="number" id="size" min="1"></input></div>');
	$('#panel').append('<div class="selectPanel">ilość kolorów: <input type="number" id="dim" min="1"></input></div>');
	$('#panel').append('<div class="selectPanel">maksymalna ilość ruchów: <input type="number" id="max" min="2"></input></div>');
    $('#panel').append('<button id="startGame">Zagraj</button>');
	
	//rozpoczęcie gry
	$('button#startGame').click(function(){
		
		var path = "http://localhost:3000/play/";

		if($('#size').val() && $('#dim').val() && $('#max').val()){
			path += "size/" + $('#size').val() + "/";
			path += "dim/" + $('#dim').val() + "/";
			path += "max/" + $('#max').val() + "/";
		}
			
		console.log(path);
		$.getJSON(path,
		function (data) {
                $('div#output').append('<p> Rozmiar: ' + data.size + '<br/> Ilość kolorów: ' + data.dim + '  </p>');
				drawGUI(data.size);
            });
	
		$('#panel').css('display', 'none');
	});
});
