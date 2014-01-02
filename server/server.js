global.log = function() {
    var msg = '';
    for( var i = 0; i < arguments.length; i++ ) {
        msg += arguments[i] + ' ';
    }
    console.log( '   host  -'.magenta, msg );
}

global._debug = true;
global.debug = function() {
    if( !global._debug ) return;

    var msg = '';
    for( var i = 0; i < arguments.length; i++ ) {
        msg += arguments[i] + ' ';
    }
    console.log( '   debug -'.grey, msg );
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
        this.io = require('socket.io').listen(this.socketPort, { log: true });

        // Bind socket events
        var self = this;
        self.io.sockets.on('connection', function(socket) {

            console.log( 'client connected' );

            // Remove player from the game
            socket.on('disconnect', function() {
                this.disconnect( 'null' );
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

    join: function() {
        
    },

    disconnect: function( message ) {
        global.log( 'client disconnected:', message );
    }

});
