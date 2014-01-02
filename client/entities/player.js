global.PlayerClient = global.Player.extend({
    
    className: 'PlayerClient',

    init: function( id, x, y, settings ) {
        this._super( id, x, y, settings );
    },

    draw: function( draw ) {
        $('.wrapper').html( this.pos.x + ',' + this.pos.y );
    }

})