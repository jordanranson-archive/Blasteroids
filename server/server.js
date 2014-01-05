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
        room: global.Constants.UNIVERSE.ROOM,
        size: global.Constants.UNIVERSE.SIZE
    },

    init: function() {
        global.log( 'starting server on', this.socketPort );

        this.bindSockets();
    },

    bindSockets: function() {
        global.log( 'binding sockets' );
        this.io = require( 'socket.io' ).listen( this.socketPort, { log: true } );
        /*if( !global.Constants.DEBUG )*/ this.io.set( 'log level', 1 );

        // Bind socket events
        var self = this;
        self.io.sockets.on( 'connection', function( socket ) {

            global.log( 'client connected'.green );

            // Player wants to join the game
            socket.on( 'game:join', function( packet ) {
                self.join( socket, packet );
            });

            // Game wants to spawn an entity
            socket.on( 'game:spawn_entity', function( packet ) {
                self.spawnEntity( packet );
            });

            // Game wants to update an entity
            socket.on( 'game:update_entity', function( packet ) {
                self.updateEntity( packet );
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

        // update all entities
        var entities = [];
        var i = this.entities.length;
        var delta = time - global.Constants.UPDATE_INTERVAL + 1;
        while( i-- ) {
            if( this.entities[i].lastUpdate <= delta ) {
                this.entities[i].update( time );
                entities.push( this.entities[i].serialize() );
            }
        }
        if( entities.length > 0 ) this.updateClientEntities( entities );

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
        socket.join( this.universe.room );

        // Create player
        var pos = this.universe.size*.5 + (Math.random()*100);
        var player = new global.Player( this.index, {
            pos: { x: pos, y: pos*.625 }, 
            vel: { x: 0, y: 0 },
            name: name,
            lastUpdate: Date.now(),
            angle: 0
        });
        this.index++; // increment global entity index

        player.shapes[1].color = String.randomColor(0);
        player.shapes[2].color = String.randomColor(64);

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
        socket.broadcast.to( this.universe.room ).emit( 'server:spawn_entities', packet );

        global.log( 'player', name.yellow, 'joined' );
    },

    disconnect: function( socket, message ) { 

        // Check if a player has been spawned for the disconnecting client
        var player = this.entities.find( 'name', socket.playername );
        if( player !== -1 ) {

            // Leave room
            socket.leave( this.universe.room );

            // Remove player from server
            this.entities.remove( player.id );
            this.players.splice( this.players.indexOf( player ), 1 );

            // Notify clients of removed entity
            var packet = global.Packet.create({
                id: player.id
            });
            this.io.sockets.in( this.universe.room ).emit( 'server:remove_entity', packet );
        }

        global.log( 'client disconnected:'.red, message );
    },

    spawnEntity: function( packet ) {
        var data = packet.data.entity;
        data.lastUpdate = packet.time;

        var entity = new global[data.className]( this.index, data );
        this.index++; // increment global entity index
        this.entities.push( entity );

        var packet = global.Packet.create({ entities: [player.serialize()] });
        this.io.sockets.in( this.universe.room ).emit( 'server:spawn_entities', packet );
    },

    updateEntity: function( packet ) {
        var data = packet.data.entity;
            data.lastUpdate = packet.time;

        // Find entity to update and update it
        var index = this.entities.indexAt( 'id', data.id );
        this.entities[index].updateEntity( data );
        this.entities[index].update( Date.now() );

        // Make clients aware of the update
        this.updateClientEntities( [this.entities[index].serialize()] );
    },

    updateClientEntities: function( entities ) {
        var packet = global.Packet.create({ entities: entities });
        this.io.sockets.in( this.universe.room ).emit( 'server:update_entities', packet );
    }
});
