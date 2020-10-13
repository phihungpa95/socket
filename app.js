var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {},
    users_name = {};

server.listen(8888);
console.log('app listen on port: 8888')


app.use(express.static(__dirname + '/public'));
app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

io.sockets.on('connection', function (socket) {

    socket.on('new user', function (name, data) {
        console.log(name + ' connected');

        if (name in users) {
            data(false);
        } else {
            data(true);
            socket.nickname = name;
            users[socket.nickname] = socket;
            users_name[name] = true;
            socket.broadcast.emit('new user', name);
            socket.emit('list all user', users_name)
            updateNickNames();
        }

    });

    function updateNickNames() {
        io.sockets.emit('usernames', Object.keys(users));
    }


    socket.on('open-chatbox', function (data) {
        users[data].emit('openbox', { nick: socket.nickname });
    });


    socket.on('send message', function (data, sendto) {
        console.log(data, sendto)

        if (users[sendto]) {
            users[sendto].emit('new message', { msg: data, nick: socket.nickname, sendto: sendto });
        }
        users[socket.nickname].emit('new message', { msg: data, nick: socket.nickname, sendto: sendto });

        console.log(data);
    });


    socket.on('disconnect', function (data) {
        if (!socket.nickname) return;

        socket.broadcast.emit('delete user', socket.nickname);


        delete users[socket.nickname];
        delete users_name[socket.nickname]
        updateNickNames();
    });
});