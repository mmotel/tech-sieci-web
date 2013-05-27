var socketio = require('socket.io'),
    guestNumber = 0,
    nickNames = { 'Lobby': [] },
    namesUsed = [ 'Lobby' ],
    currentRoom = {};
    currentNick = {};
var cookie  =   require('cookie');
var connect =   require('connect');

var currentUid = {};
var newUid = false;

var assignGuestName = function (socket,guestNumber,nickNames,namesUsed){
    socket.on('hello', function (data) {
        if(data === 0){
            var d = new Date();
            var n = d.getTime();
            socket.emit('setUid', {'uid': n, 'newUid': true });
                console.log('setUid ' + n + ' : ' + true);
        }
        console.log(data);
        //guestNumber +=1;
        if(!currentNick[data]){
            currentRoom[data] = 'Lobby';
            var nick = 'Gość ' + (nickNames[currentRoom[data]].length);
            currentNick[data] = nick;
            nickNames[currentRoom[data]].push({'nick': nick, 
            'user': data, 'socket': socket});
        } else {
            for(var i =0; i < namesUsed.length; i++){
                for(var j=0; j < nickNames[namesUsed[i]].length; j++){
                    if(nickNames[namesUsed[i]][j] && 
                        nickNames[namesUsed[i]][j].user === data){
                        nickNames[namesUsed[i]][j].socket = socket;
                    }
                    console.log('. ');
               }
            }
        }

        socket.emit('joinResult', {room: currentRoom[data],
            nick: currentNick[data] , roomsList: namesUsed });

    });

    // return guestNumber;
};

var handleMessageBroadcasting = function (socket, nickNames){
        socket.on('msg', function(data) {
            var newData = {};
            newData.nick = currentNick[data.uid];
            newData.msg = data.msg;
            console.log(data.msg + " : " + data.uid + ' n: ' + currentNick[data.uid] + ' r: ' + currentRoom[data.uid] +
                 ' sid: ' + socket.id);
            console.log(nickNames[currentRoom[data.uid]]);
            for(var i =0; i < nickNames[currentRoom[data.uid]].length; i++){
                if(nickNames[currentRoom[data.uid]][i] &&
                    currentRoom[nickNames[currentRoom[data.uid]][i].user] 
                    === currentRoom[data.uid] && nickNames[currentRoom[data.uid]][i].socket){
                    // console.log(nickNames[currentRoom[socket.id]].length);
                    // console.log(nickNames[currentRoom[socket.id]][i].socket);
                    nickNames[currentRoom[data.uid]][i].socket.emit('newMsg', 
                        newData);
                    // socket.broadcast.to(currentRoom[socket.id]).emit('newMsg', newData);
                }
            }
        });
};

var handleNameChangeAttempts = function (socket, nickNames, namesUsed){
    socket.on('changeNick', function(data) {
        var newNick = data.nick;
        var room = currentRoom[data.uid];
        var nick = currentNick[data.uid];
        console.log("n: " + nick + ' r: ' + room);

        var nickExists = false;

        var nickList = nickNames[room];
        //console.log(nickList);
        for(var i =0; i < nickList.length; i++){
            if(nickList[i] && nickList[i].nick === newNick){
                nickExists = true;
                break;
            }
        }
        // console.log('nickExists ' + nickExists);
        if(nickExists){
            socket.emit('changeNickFailed', {'room': room, 
                'nick': nick, 'newNick': newNick});
            // console.log('failed');
        }else {
            var userNo;
            for(var i =0; i < nickList.length; i++){
                if(nickList[i] && nickList[i].user === data.uid){
                    userNo = i;
                    break;
                }
            }
            if(userNo){
                nickList[userNo.i].nick = newNick;
            }
            // } else {
            //     nickList.push({'nick': newNick, 'user': data.uid, 'socket': socket});
            // }
            currentNick[data.uid] = newNick;
            socket.emit('changeNickSuccess', {'room': room, 'nick': nick, 'newNick': newNick});
            // console.log('success');
        }

    });
};

var handleRoomJoining = function (socket, nickNames, namesUsed){
    socket.on('changeRoom', function (data) {
        if(nickNames[data.room]){
            var nickList = nickNames[data.room];
            socket.id
            var userExists = false;
            var nickExists = false;
            var userNo;
            for(var i = 0; i < nickList.length; i++){
                if(nickList[i] && nickList[i].user === data.uid){
                    userExists = true;
                    userNo = i;
                }
                if(nickList[i] && nickList[i].nick === 
                    currentNick[data.uid] && nickList[i].user !== data.uid)
                {
                    nickExists = true;
                }
            }
            if(userExists){
                // socket.join(data);
                currentRoom[data.uid] = data.room;
                currentNick[data.uid] = nickList[userNo].nick;
            } else {
                if(!nickExists){
                    // socket.join(data);
                    nickList.push({'nick': currentNick[data.uid], 
                        'user': data.uid, 'socket': socket});
                    currentRoom[data.uid] = data.room;
                }else {
                    // socket.join(data);
                    nickList.push({'nick': 'Gość ' + (nickList.length+1), 
                        'user': data.uid, 'socket': socket});
                    currentRoom[data.uid] = data.room;
                    currentNick[data.uid] = 'Gość ' + (nickList.length+1);
                }
            }
        } else {
            nickNames[data.room] = [];
            nickNames[data.room].push({'nick': currentNick[data.uid], 
                'user': data.uid, 'socket': socket});
            namesUsed.push(data.room);
            currentRoom[data.uid] = data.room;
            socket.broadcast.emit('newRoom',{roomsList:namesUsed});
        }

         socket.emit('joinResult', {room: currentRoom[data.uid], 
            nick: currentNick[data.uid] , roomsList: namesUsed });

    });
};

var handleClientDisconnection = function (socket, nickNames, namesUsed){
    socket.on('disconnect', function() {
      //TO-DO
      // console.log('got disconnect!');

      for(var i =0; i < namesUsed.length; i++){
        for(var j=0; j < nickNames[namesUsed[i]].length; j++){
            if(nickNames[namesUsed[i]][j] && 
                nickNames[namesUsed[i]][j].socket.id === socket.id){
                nickNames[namesUsed[i]][j].socket = undefined;
            }
            console.log('. ');
        }
      }
    });
}

exports.listen = function(server) {
    var io = socketio.listen(server);
    io.set('log level', 1);

    io.set('authorization', function (handshakeData, accept) {
        if (handshakeData.headers.cookie) {
            handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
            handshakeData.sessionID = 
                connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');

            if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
                return accept('Cookie is invalid.', false);
            }
        } else {
           return accept('No cookie transmitted.', false);
        } 
        // accept the incoming connection
        accept(null, true);
    }); 

    io.sockets.on('connection', function (socket) {
        // socket.join('Lobby');

        assignGuestName(socket,guestNumber,nickNames,namesUsed);
        
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket, nickNames, namesUsed);
        handleClientDisconnection(socket, nickNames, namesUsed);


    });
};
