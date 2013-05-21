var socketio = require('socket.io'),
    guestNumber = 0,
    nickNames = { 'Lobby': [] },
    namesUsed = [ 'Lobby' ],
    currentRoom = {};
    currentNick = {};

var assignGuestName = function (socket,guestNumber,nickNames,namesUsed){
    guestNumber +=1;
    var nick = 'Gość ' + guestNumber;
    nickNames[currentRoom[socket.id]].push({'nick': nick, 'user': socket.id, 'socket': socket});
    currentNick[socket.id] = nick;
    return guestNumber;
};

var handleMessageBroadcasting = function (socket, nickNames){
        socket.on('msg', function(data) {
            var newData = {};
            newData.nick = currentNick[socket.id];
            newData.msg = data;
            for(var i =0; i < nickNames[currentRoom[socket.id]].length; i++){
                if(nickNames[currentRoom[socket.id]][i] &&
                    currentRoom[nickNames[currentRoom[socket.id]][i].user] === currentRoom[socket.id]){
                    // console.log(nickNames[currentRoom[socket.id]].length);
                    // console.log(nickNames[currentRoom[socket.id]][i].socket);
                    nickNames[currentRoom[socket.id]][i].socket.emit('newMsg', newData);
                    // socket.broadcast.to(currentRoom[socket.id]).emit('newMsg', newData);
                }
            }
        });
};

var handleNameChangeAttempts = function (socket, nickNames, namesUsed){
    socket.on('changeNick', function(data) {
        var newNick = data;
        var room = currentRoom[socket.id];
        var nick = currentNick[socket.id];

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
            socket.emit('changeNickFailed', {'room': room, 'nick': nick, 'newNick': newNick});
            // console.log('failed');
        }else {
            var userNo = {};
            for(var i =0; i < nickList.length; i++){
                if(nickList[i] && nickList[i].user === socket.id){
                    userNo.i = i;
                }
            }
            if(userNo.i){
                nickList[userNo.i].nick = newNick;
            } else {
                nickList.push({'nick': newNick, 'user': socket.id});
            }
            currentNick[socket.id] = newNick;
            socket.emit('changeNickSuccess', {'room': room, 'nick': nick, 'newNick': newNick});
            // console.log('success');
        }

    });
};

var handleRoomJoining = function (socket, nickNames, namesUsed){
    socket.on('changeRoom', function (data) {
        if(nickNames[data]){
            var nickList = nickNames[data];

            var userExists = false;
            var nickExists = false;
            var userNo;
            for(var i = 0; i < nickList.length; i++){
                if(nickList[i] && nickList[i].user === socket.id){
                    userExists = true;
                    userNo = i;
                }
                if(nickList[i] && nickList[i].nick === currentNick[socket.id] && nickList[i].user !== socket.id){
                    nickExists = true;
                }
            }
            if(userExists){
                // socket.join(data);
                currentRoom[socket.id] = data;
                currentNick[socket.id] = nickList[userNo].nick;
            } else {
                if(!nickExists){
                    // socket.join(data);
                    nickList.push({'nick': currentNick[socket.id], 'user': socket.id, 'socket': socket});
                    currentRoom[socket.id] = data;
                }else {
                    // socket.join(data);
                    nickList.push({'nick': 'Gość ' + (nickList.length+1), 'user': socket.id, 'socket': socket});
                    currentRoom[socket.id] = data;
                    currentNick[socket.id] = 'Gość ' + (nickList.length+1);
                }
            }
        } else {
            nickNames[data] = [];
            nickNames[data].push({'nick': currentNick[socket.id], 'user': socket.id, 'socket': socket});
            namesUsed.push(data);
            currentRoom[socket.id] = data;
            socket.broadcast.emit('newRoom',{roomsList:namesUsed});
        }

         socket.emit('joinResult', {room: currentRoom[socket.id], nick: currentNick[socket.id] , roomsList: namesUsed });

    });
};

var handleClientDisconnection = function (socket, nickNames, namesUsed){
    socket.on('disconnect', function() {
      //TO-DO
      console.log('got disconnect!');

      for(var i =0; i < namesUsed.length; i++){
        for(var j=0; j < nickNames[namesUsed[i]].length; j++){
            if(nickNames[namesUsed[i]][j] && nickNames[namesUsed[i]][j].user === socket.id){
                nickNames[namesUsed[i]][j] = undefined;
            }
        }
      }
    });
}

exports.listen = function(server) {
    var io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {
        // socket.join('Lobby');
        currentRoom[socket.id] = 'Lobby';
        guestNumber = assignGuestName(
            socket,
            guestNumber,
            nickNames,
            namesUsed
        );

        socket.emit('joinResult', {room: currentRoom[socket.id], nick: currentNick[socket.id] , roomsList: namesUsed });
        
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket, nickNames, namesUsed);
        handleClientDisconnection(socket, nickNames, namesUsed);


    });
};
