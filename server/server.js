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

    entities: [],

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
            socket.on( 'join', function( packet ) {
                self.join( packet );
            });

            // Remove player from the game
            socket.on( 'disconnect', function() {
                self.disconnect( 'disconnected' );
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

    join: function( packet ) {
        var time = packet.time;
        var name = packet.data.name;

        global.log( 'player', name.yellow, 'joined' );
    },

    disconnect: function( message ) {
        global.log( 'client disconnected:'.red, message );
    }

});
