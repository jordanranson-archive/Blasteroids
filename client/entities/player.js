global.PlayerClient = global.Player.extend({
    
    className: 'PlayerClient',
    clientClassName: 'PlayerClient',

    init: function( id, settings ) {
        this._super( id, settings );
    },

    draw: function( draw ) {
        $('.wrapper').html( this.pos.x + ',' + this.pos.y );
    }

})