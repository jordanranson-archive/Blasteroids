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
    },

    update: function( time ) {

        // Update input handler
        this.input.update();

        // Handle input
        for( var i = this.entities.length-1; i >= 0; i-- ) {
            this.entities[i].update( time, this.input );
        }

        // Update
        for( var i = this.entities.length-1; i >= 0; i-- ) {
            this.entities[i].update( time );
        }

        // Draw
        for( var i = this.entities.length-1; i >= 0; i-- ) {
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
    }

});