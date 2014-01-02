global.Game = global.Class.extend({
    
    input: null,
    draw: null,
    camera: null,

    entities: [],
    particles: [],

    universe: {},
    playerName: 'anonymous',

    init: function() {
        this.input = new global.Input();
        this.draw = new global.Draw('#canvas');
        this.camera = new global.Camera();

        this.spawnEntity( 'PlayerClient', 0, 0, 0, {} );
    },

    update: function( time ) {

        // Update input handler
        this.input.update();

        // Update
        var i = this.entities.length;
        while( i-- ) {
            this.entities[i].handleInput( time, this.input ); 
            this.entities[i].update( time );
        }

        // Draw
        i = this.entities.length;
        while( i-- ) {
            this.entities[i].draw( this.draw );
        }
    },

    run: function() {
        var self = this;

        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame   ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        (function animloop(){
            requestAnimFrame(animloop);
            self.update( Date.now() );
        })();
    },

    spawnEntity: function( className, id, x, y, settings ) {
        if( settings === undefined ) settings = {};

        var entity = new global[className]( id, x, y, settings );
        this.entities.push( entity );

        console.log( 'spawned:', entity );
        return entity;
    }

});