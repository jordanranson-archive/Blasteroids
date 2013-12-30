var io = require('socket.io').listen(3000, { log: false });
require('./util.js');

var asteroidindex = 0;
var _numAsteroids = 100;

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

for( var i = 0; i < _numAsteroids; i++ ) {
    var asteroid = {
        name: 'a'+(asteroidindex++),
        type: 'asteroid',
        pos: {x: Math.random()*universe.size, y: Math.random()*universe.size},
        last: {x: 0, y: 0},
        vel: {x: Math.random()*3, y: Math.random()*3},
        angle: Math.random()*360,
        alive: true,
        color: '#444',
        radius: (Math.random()*290<<0)+20,
        sides: (Math.random()*4<<0)+5,
        spawning: true,
        ore: 'none',
        oreAmount: 0
    };
    entities.push(asteroid);
}

var self = this;
(function loop() {
    var count = 0;
    for( var i = 0; i < entities.length; i++ ) {
        if( entities[i].type === 'asteroid' && entities[i].alive ) {
            count++;
        }
    }
    console.log( count );

    for( var i = 0; i < _numAsteroids - count; i++ ) {
        var asteroid = {
            name: 'a'+(asteroidindex++),
            type: 'asteroid',
            //pos: {x: Math.random()*universe.size, y: Math.random()*universe.size},
            pos: {x: universe.size*.5, y: universe.size*.5},
            last: {x: 0, y: 0},
            //vel: {x: Math.random()*3, y: Math.random()*3},
            vel: {x: 0, y: 0},
            angle: Math.random()*360,
            alive: true,
            color: '#444',
            radius: 20,
            spawning: true,
            ore: 'none',
            oreAmount: 0
        };
        entities.push(asteroid);
        console.log( asteroid.pos.x )
    }

    setTimeout(function() {
        loop();
    }, 3000);
})();

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
        socket.emit('updatechat', 'SERVER', 'Welcome to deep space, ' + socket.playername + '.');
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.playername + ' warped in.');

        heartbeat = setTimeout(function() {
            disconnect(socket, ' timed out.');
        }, 30000);
    });

    socket.on('ping', function(name) {
        if( socket.playername === name ) {
            clearTimeout(heartbeat);
            heartbeat = setTimeout(function() {
                disconnect(socket, ' timed out.');
            }, 30000);
        }
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