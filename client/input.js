global.Input = global.Class.extend({

    keys: [],
    prev: 0,

    bindings: {},
    
    init: function() {
        var self = this;

        $( document ).on( 'keydown', function( e ) { self.keydown( e ) } );
        $( document ).on( 'keyup', function( e ) { self.keyup( e ) } );
    },

    keydown: function( evt ) {
        if( evt.keyCode === this.prev && this.keys[evt.keyCode] !== undefined ) return false;
        else this.prev = evt.keyCode;

        if( !$( 'input' ).is( ':focus' ) ) this.keys[evt.keyCode] = -1;
    },

    keyup: function( evt ) {
        this.prev = 0;
        delete this.keys[evt.keyCode];
    },

    pressed: function( key ) {
        if( this.bindings[key] !== undefined ) {
            var result = this.keys[this.bindings[key]] === -1;
            this.keys[this.bindings[key]] = 1;

            return result;
        }

        return false;
    },

    state: function( key ) {
        var result = (this.bindings[key] !== undefined) && (this.keys[this.bindings[key]] !== undefined);
        
        return result;
    },

    update: function() {
        for( var i = 0; i < this.keys.length; i++ ) {
            if( this.keys[i] === -1 ) {
                this.keys[i] = 1;
            }
        }
    },

    bind: function( action, key ) {
        this.bindings[action] = key;

        console.log( action, key );
    }

});