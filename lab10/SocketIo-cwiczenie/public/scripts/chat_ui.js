$(function () {

    var chatUid = {};

	//łączenie z serwerem
    socket = io.connect('http://localhost:3000');
	console.log('connecting…');

    socket.on('connect', function (data) {
        console.log('Połączony!');
        var getCookie = function (c_name)
        {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1) {  c_start = c_value.indexOf(c_name + "="); }
        if (c_start == -1) { c_value = null; }
        else
          { c_start = c_value.indexOf("=", c_start) + 1; var c_end = c_value.indexOf(";", c_start);
          if (c_end == -1) { c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
        }
        return c_value;
        }

        var uid = getCookie("uid");
        if(uid!=null && uid!=""){
            chatUid = uid;
            
        }
        else {
            chatUid = 0;
        }
        socket.emit('hello', chatUid);
    });

    $('#send').click(function (){
    	var msg = $('#msg').val();
    	if(msg.length > 0){
    		if(msg.substring(0,5) === '/nick'){
    			socket.emit('changeNick', {'nick': msg.substring(6, msg.length), 'uid': chatUid});
    		} else if(msg.substring(0,5) === '/join'){
    			socket.emit('changeRoom', {'room': msg.substring(6, msg.length), 'uid': chatUid});
    		}
    		 else {
    			socket.emit('msg', {'msg': msg, 'uid': chatUid});
    		}
    		$('#msg').val('');
    	}
    });

    socket.on('setUid', function (data){
        setCookie = function (c_name,value,exdays) {
             var exdate=new Date();
             exdate.setDate(exdate.getDate() + exdays);
             var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
             document.cookie=c_name + "=" + c_value;
         };
        if(data['newUid']){
            setCookie('uid',data['uid'],365);
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