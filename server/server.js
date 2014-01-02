global.log = function() {
    var msg = '';
    for( var i = 0; i < arguments.length; i++ ) {
        msg += arguments[i] + ' ';
    }
    console.log( '   host  -'.magenta, msg );
}

global.debug = function() {
    if( !global.Constants.DEBUG ) return;

    var msg = '';
    for( var i = 0; i < arguments.length; i++ ) {
        msg += arguments[i] + ' ';
    }
    console.log( '   debug -'.grey, msg );
}

global.Server = global.Class.extend({

    io: null,
    socketPort: global.Constants.SERVER_PORT,
    updateInterval: global.Constants.UPDATE_INTERVAL,

    index: 0,
    entities: [],
    players: [],

    universe: {
        size: global.Constants.UNIVERSE.SIZE
    },

    init: function() {
        global.log( 'starting server on', this.socketPort );

        this.bindSockets();
    },

    bindSockets: function() {
        global.log( 'binding sockets' );
        this.io = require( 'socket.io' ).listen( this.socketPort, { log: true } );
        if( !global.Constants.DEBUG ) this.io.set( 'log level', 1 );

        // Bind socket events
        var self = this;
        self.io.sockets.on( 'connection', function( socket ) {

            global.log( 'client connected'.green );

            // Player wants to join the game
            socket.on( 'game:join', function( packet ) {
                self.join( socket, packet );
            });

            // Remove player from the game
            socket.on( 'disconnect', function() {
                self.disconnect( socket, 'disconnected' );
            });

        });
    },

    // Periodically update all entities and clients
    update: function() {
        var time = Date.now();

        // do update code here

        var d = new Date(time);
        global.debug( 'updated @', d.getHours()+':'+d.getMinutes()+':'+d.getSeconds() );
    },

    run: function() {
        var self = this;
        (function loop() {
            self.update();
            setTimeout(function() {
                loop();
            }, self.updateInterval);
        })();
    },

    join: function( socket, packet ) {
        var time = packet.time;
        var name = packet.data.name;
        var packet;

        // Check to see if name is valid
        if( name === null || name.length === 0 ) {
            packet = global.Packet.create({ msg: 'Invalid player name.' });
            socket.emit( 'server:invalid_name', packet );

            return;
        }

        // Check to see if player name exists
        if( this.players.indexOf( name ) !== -1 ) {
            global.log( 'duplicate player name'.red );
            packet = global.Packet.create({ msg: 'That name is already in use.' });
            socket.emit( 'server:invalid_name', packet );

            return;
        }

        // Set socket player name and join main room
        socket.playername = name;
        socket.room = 'space';
        socket.join('space');

        // Create player
        var pos = this.universe.size*.5;
        var player = new global.Player( this.index, {
            pos: { x: pos, y: pos*.625 }, 
            vel: { x: 0, y: 0 },
            name: name,
            lastUpdate: Date.now(),
            angle: 0
        });
        player.bindSockets( this.socket );
        this.index++; // increment global entity index

        // Add player to game
        this.players.push( name );
        this.entities.push( player );

        // Notify client of successful join
        packet = global.Packet.create({ name: name });
        socket.emit( 'server:join', packet );

        // Notify player of all entities
        var entities = [], len = this.entities.length;
        while( len-- ) entities.push( this.entities[len].serialize() );
        packet = global.Packet.create({ entities: entities });
        socket.emit( 'server:spawn_entities', packet );

        // Notify all other clients of new player
        packet = global.Packet.create({ entities: [player.serialize()] });
        socket.broadcast.to( socket.room ).emit( 'server:spawn_entities', packet );

        global.log( 'player', name.yellow, 'joined' );
    },

    disconnect: function( socket, message ) { 

        // Check if a player has been spawned for the disconnecting client
        var player = this.entities.find( 'name', socket.playername );
        if( player !== -1 ) {

            // Leave room
            socket.leave( socket.room );

            // Remove player from server
            this.entities.remove( player.id );
            this.players.splice( this.players.indexOf( player ), 1 );

            // Notify clients of removed entity
            var packet = global.Packet.create({
                id: player.id
            });
            this.io.sockets.in( socket.room ).emit( 'server:remove_entity', packet );
        }

        global.log( 'client disconnected:'.red, message );
    }

});
