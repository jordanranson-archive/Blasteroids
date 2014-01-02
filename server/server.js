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
    console.log( '   host  -'.grey, msg );
}

global.Server = global.Class.extend({

    io: null,
    socketPort: 3000,
    updateInterval: 5000,

    index: 0,
    entities: [],
    players: [],

    universe: {
        size: 10000
    },

    init: function( port ) {
        this.socketPort = port ? port : 3000;
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

        // Check to see if player name exists
        if( this.players.indexOf( name ) !== -1 ) {
            global.log( 'duplicate player name'.red );
            socket.emit( 'server:duplicate_name' );

            return;
        }

        // Set socket player name and join main room
        socket.playername = name;
        socket.room = 'space';
        socket.join('space');

        // Create player and add to game
        var pos = this.universe.size*.5;
        var player = new global.Player( this.index, { pos: { x: pos, y: pos }, name: name } );
        this.index++; // increment global entity index
        this.players.push( name );
        this.entities.push( player );

        // Notify client of successful join
        var packet = global.Packet.create({
            name: name
        });
        socket.emit( 'server:join', packet );

        // Notify clients of new player
        packet = global.Packet.create({
            entities: [player.serialize()]
        });
        this.io.sockets.in( socket.room ).emit( 'server:spawn_entities', packet );

        global.log( 'player', name.yellow, 'joined' );
    },

    disconnect: function( socket, message ) { 

        // Leave room
        socket.leave( socket.room );

        // Remove player from server
        var player = this.players.find( 'name', socket.playername );
        this.entities.remove( player.id );
        this.players.slice( this.players.indexOf( player ), 1 );

        // Notify clients of removed entity
        var packet = global.Packet.create({
            name: socket.playername
        });
        this.io.sockets.in( socket.room ).emit( 'server:remove_entity', packet );

        global.log( 'client disconnected:'.red, message );
    }

});
