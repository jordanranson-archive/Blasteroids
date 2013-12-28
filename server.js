var io = require('socket.io').listen(3000, { log: false });
require('./util.js');

var entities = [];

io.sockets.on('connection', function(socket) {

    /* Cheat Sheet */
    // io.sockets.in(socket.room).emit()        <== all clients
    // socket.broadcast.to(socket.room).emit()  <== all clients but sender
    // socket.emit()                            <== only sender

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
        socket.emit('updatechat', 'SERVER', 'Welcome to deep space, ' + socket.playername);
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.playername + 'warped in.');
    });

    // Update an entity
    socket.on('updateentity', function(entity) {
        entities.update(entity.name, entity);
        io.sockets.in(socket.room).emit('updateentities', entities);
    });

    // Send chat message
    socket.on('sendchat', function(data) {
        io.sockets.in(socket.room).emit('updatechat', socket.playername, data);
    });

    // Remove player from the game
    socket.on('disconnect', function() {

        // Goodbye message
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.playername + ' warped out.');
        socket.leave(socket.room);

        // Remove player
        entities.remove(socket.playername);
        io.sockets.in(socket.room).emit('updateentities', entities);
    });

});