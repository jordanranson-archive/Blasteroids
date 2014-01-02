global.Draw = global.Class.extend({
    
    canvas: null,
    context: null,

    clearColor: '#136',

    init: function( selector, clearColor ) {
        
        this.canvas = $( selector )[0];
        this.context = this.canvas.getContext( '2d' );
        this.clearColor = clearColor;

        $(window).on( 'resize', this.resize );
        this.resize();

    },

    resize: function() {
        var $w = $( window );
        $( this.canvas )
            .attr( 'width', $w.width() )
            .attr( 'height', $w.height() );
    },

    clear: function() {
        this.context.fillStyle = this.clearColor;
        this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
    }



});