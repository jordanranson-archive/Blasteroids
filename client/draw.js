global.Draw = global.Class.extend({
    
    canvas: null,
    context: null,

    init: function( selector ) {
        
        this.canvas = $( selector )[0];
        this.context = this.canvas.getContext( '2d' );

        $(window).on('resize', this.resize);
        this.resize();

    },

    resize: function() {
        var $w = $( window );
        $( this.canvas )
            .attr( 'width', $w.width() )
            .attr( 'height', $w.height() );
    }

});