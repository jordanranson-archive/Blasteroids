var io = require('socket.io').listen(3000, { log: false });
require('./util.js');

var entities = [];
var universe = {
    size: 10000
};

function disconnect(socket, message) {
        // Goodbye message
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.playername + message);
        socket.leave(socket.room);

        // Remove player
        entities.remove(socket.playername);
        io.sockets.in(socket.room).emit('removeplayer', socket.playername);
        io.sockets.in(socket.room).emit('updateentities', entities);
}

io.sockets.on('connection', function(socket) {

    /* Cheat Sheet */
    // io.sockets.in(socket.room).emit()        <== all clients
    // socket.broadcast.to(socket.room).emit()  <== all clients but sender
    // socket.emit()                            <== only sender

    var heartbeat;

    // send info about server to client
    socket.emit('aboutuniverse', universe);

    // Join the main room
    socket.on('join', function(player) {

        // Join the room
        socket.playername = player.name;
        socket.room = 'Space';
        socket.join('Space');

        // Add player to entities list and update clients
        entities.push(player);
        io.sockets.in(socket.room).emit('updateentities', entities);

        // Announce to players
        socket.emit('joined');
        socket.emit('updatechat', 'SERVER', 'Welcome to deep space, ' + socket.playername);
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.playername + ' warped in.');

        heartbeat = setTimeout(function() {
            disconnect(socket, ' timed out.');
        }, 30000);
    });

    socket.on('ping', function() {
        clearTimeout(heartbeat);
        heartbeat = setTimeout(function() {
            disconnect(socket, ' timed out.');
        }, 30000);
    });

    // Update an entity
    socket.on('updateentity', function(entity) {
        entities.update(entity.name, entity);
        socket.broadcast.to(socket.room).emit('updateentity', entity);
    });

    // Spawn an entity
    socket.on('spawnentity', function(entity) {
        entities.push(entity);
        io.sockets.in(socket.room).emit('spawnentity', entity, entities.length-1);
    });

    // Remove an entity
    socket.on('removeentity', function(name) {
        entities.remove(name);
        io.sockets.in(socket.room).emit('removeentity', name);
    });

    // Send chat message
    socket.on('sendchat', function(data) {
        io.sockets.in(socket.room).emit('updatechat', socket.playername, data);
    });

    // Remove player from the game
    socket.on('disconnect', function() {
        clearTimeout(heartbeat);
        disconnect(socket, ' warped out.');
    });

});