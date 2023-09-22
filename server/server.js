const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const shared_classes = require('./shared_classes');
const battle = require('./battle');

const app = express();

app.use(express.static('../client'));

const server = http.createServer(app);
const io = socketio(server);

var players = [];
var secrets = [];
var teams = [];

const newSecret = () => {
    var s = Math.floor(Math.random() * 100);

    while (secrets.includes(s)) {
        s = Math.floor(Math.random() * 100);
    }

    return s;
}

const convertTeam = (team) => {
    var newTeam = [];

    team.forEach((mon) => {
        newTeam.push(new shared_classes.Mon(mon));
    })

    return newTeam;
}

// on new user connection
io.on('connection', (sock) => {
    // emit welcome message to new user
    sock.emit('chat', 'you are connected');
    sock.emit('update-player', players);

    // get new hidden id for new user.
    secret = newSecret();
    sock.emit('secret', secret);

    // when receiving chat, return chat to all users to display
    sock.on('chat', (text) => io.emit('chat', text));

    sock.on('joingame', (name, s, team) => {
        if (players.length < 2 && !secrets.includes(s)) {     

            var mon_team = convertTeam(team);  

            players.push(name);
            secrets.push(s);
            teams.push(mon_team);

            sock.emit('join-success');
            io.emit('chat', 'player ' + name + ' joined the game.');
            io.emit('update-player', players);

            mon_team.forEach((mon) => {
                sock.emit('chat', mon.toString())
            })
        }
        else {
            sock.emit('chat', 'Unable to join game, there are already 2 players: ' + players);
        }
    });

    sock.on('leavegame', (s) => {
        if (secrets.includes(s)) {
            var index = secrets.indexOf(s);
            var name = players[index];

            players.splice(index, 1);
            secrets.splice(index, 1);
            teams.splice(index, 1);

            sock.emit('leave-success');
            io.emit('chat', 'player ' + name + ' left the game.');
            io.emit('update-player', players);
        } 
        else{
            sock.emit('chat', 'Unable to leave game, you are not one of the 2 players: ' + players);
        }
    });
})


server.on('error', (err) => {
    console.error(err);
})

server.listen(80, () => {
    console.log('ready');
})