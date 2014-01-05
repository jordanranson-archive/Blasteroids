global.PlayerClient = global.Player.extend({
    
    className: 'PlayerClient',
    clientClassName: 'PlayerClient',

    canvas: null,

    stateEvents: [
        'forward', 
        'backward', 
        'turnLeft', 
        'turnRight'
    ],

    pressedEvents: [
        'shoot',
        'ability',
        'switchAbility'
    ],

    update: function( time, game ) {
        this._super( time );

        if( game.playerName === this.name ) {
            this.handleInput( game.input, game.socket );
        }
    },

    render: function( draw ) {
        var canvas = document.createElement('canvas');
        canvas.width = this.size.x;
        canvas.height = this.size.y;

        var context = canvas.getContext('2d');

        draw.begin( context, 0, 0, canvas.width, canvas.height );

        // Draw ship components
        var points;
        for( var i = 0, len = this.shapes.length; i < len; i++ ) {
            points = draw.scalePoints( this.shapes[i].points, context.scalar );
            draw.style( context, { lineColor: this.shapes[i].color } );
            draw.doublePolygon( context, 0, 0, points )
        };

        draw.finish( context );

        return canvas;
    },

    draw: function( draw ) {

        // Render ship and cache the canvas
        if( this.canvas === null ) {
            this.canvas = this.render( draw );
        }

        var context = draw.context;
        draw.begin( 
            context, 
            this.pos.x.toFixed(1)-(this.size.x*.5), 
            this.pos.y.toFixed(1)-(this.size.y*.5), 
            this.canvas.width, 
            this.canvas.height, 
            this.angle+90
        );

        // Draw the ship
        draw.image( context, this.canvas, 0, 0 );

        draw.finish( context );
    },

    handleInput: function( input, socket ) {

        var inputChanged = false;

        var i = this.stateEvents.length;
        while( i-- ) {
            this.inputState[this.stateEvents[i]] = input.state( this.stateEvents[i] ) ? inputChanged = true : false;
        }

        i = this.pressedEvents.length;
        while( i-- ) {
            this.inputState[this.pressedEvents[i]] = input.pressed( this.pressedEvents[i] ) ? inputChanged = true : false;
        }

        if( inputChanged ) {
            var packet = global.Packet.create({ entity: this.serialize() });
            socket.emit( 'game:update_entity', packet );
        }

    }

})