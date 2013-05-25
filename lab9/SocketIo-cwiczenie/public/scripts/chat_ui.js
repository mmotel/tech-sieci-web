$(function () {

	//łączenie z serwerem
    socket = io.connect('http://localhost:3000');
	console.log('connecting…');

    socket.on('connect', function (data) {
        console.log('Połączony!');
    });

    $('#send').click(function (){
    	var msg = $('#msg').val();
    	if(msg.length > 0){
    		if(msg.substring(0,5) === '/nick'){
    			socket.emit('changeNick', msg.substring(6, msg.length));
    		} else if(msg.substring(0,5) === '/join'){
    			socket.emit('changeRoom', msg.substring(6, msg.length));
    		}
    		 else {
    			socket.emit('msg', msg);
    		}
    		$('#msg').val('');
    	}
    });

    socket.on('newMsg', function (data){

    	$('#chatMsgs').
        prepend('<tr><td><span class="label label-inverse">'+data.nick+
            '</span> '+data.msg+"</td></td>");
    });

    socket.on('joinResult', function (data) {
    	$('#chatMsgs').prepend('<tr><td><span class="label label-success">'+
            data.nick+'</span> Dołączyłeś/aś do pokoju: '+
    		data.room+' jako '+data.nick+'.</td></tr>');
    	$('#roomsList').children().remove();
    	$(data.roomsList).each(function(){
    		$('#roomsList').append('<tr><td>'+this+'</tr></td>');
    	});
    });

    socket.on('newRoom', function (data){
    	$('#roomsList').children().remove();
    	$(data.roomsList).each(function(){
    		$('#roomsList').append('<tr><td>'+this+'</tr></td>');
    	});
    });

    socket.on('changeNickFailed', function (data){
    	$('#chatMsgs').prepend('<tr><td><span class="label label-important">'+
            data.nick+'</span> Zmiana identyfikatora na: '+
    		data.newNick +' nie powiodła się.</td></tr>');
    });

    socket.on('changeNickSuccess', function (data){
    	$('#chatMsgs').prepend('<tr><td><span class="label label-success">'+
            data.newNick+'</span> Zmiana identyfikatora na: '+
    		data.newNick +' powiodła się.</td></tr>');
    });
});