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
    },

    scalePoints: function( points, scalar ) {
        var scaled = [];
        for( var i = 0, len = points.length; i < len; i++ ) {
            scaled.push( { x: points[i].x*scalar, y: points[i].y*scalar } );
        }
        return scaled;
    },

    begin: function( context, x, y, w, h, angle ) {
        
        context.save();

        context.translate( x, y );
        context.translate( w*.5, h*.5 );
        context.rotate( Math.radians( angle ? angle : 0 ) );

        context.globalAlpha = 1;
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = global.Constants.DEFAULT_FILL_STYLE;
        context.strokeStyle = global.Constants.DEFAULT_STROKE_STYLE;
        context.scalar = global.Constants.PIXEL_SCALAR;

        context.lineWidth = global.Constants.DEFAULT_LINE_WIDTH;
        context.lineCap = 'round';
        context.lineJoin = 'bevel';

    },

    finish: function( context ) {
        context.restore();
    },

    style: function( context, options ) {

        if( options.color ) {
            context.fillStyle = options.color;
            context.strokeStyle = options.color;
        } 
        else {
            if( options.fillColor ) context.fillStyle = options.fillColor;
            if( options.lineColor ) context.strokeStyle = options.lineColor;
        }

        if( options.lineWidth ) context.lineWidth =     options.lineWidth;
        if( options.lineCap )   context.lineCap =       options.lineCap;
        if( options.lineJoin )  context.lineJoin =      options.lineJoin;

        if( options.alpha )     context.globalAlpha =   options.alpha;
        if( options.scalar )    context.scalar =        options.scalar;
        if( options.rotate )    context.rotate(         Math.radians( options.rotate ) );
        if( options.operation ) context.globalCompositeOperation = options.operation;

    },

    image: function( context, canvas, x, y ) {
        context.drawImage( 
            canvas, 
            x - canvas.width*.5, 
            y - canvas.height*.5
        );
    },

    circle: function( context, x, y, radius ) {
        context.beginPath();
        context.arc( x, y, radius, 0, 2*Math.PI );
        context.stroke();
    },

    polygon: function( context, x, y, points ) {
        context.moveTo( x + points[0].x, y + points[0].y );

        context.beginPath();
        for( var k = 0; k < points.length; k++ ) {
            x = x + points[k].x;
            y = y + points[k].y;
            context.lineTo( x, y );
        }
        context.closePath();

        context.stroke();
        context.fill();
    },

    polygon: function( context, x, y, points ) {
        context.moveTo( x + points[0].x, y + points[0].y );

        context.beginPath();
        var px, py;
        for( var k = 0, len = points.length; k < len; k++ ) {
            px = x + points[k].x;
            py = y + points[k].y;
            context.lineTo( x, y );
        }
        context.closePath();

        context.stroke();
        context.fill();
    },

    doublePolygon: function( context, x, y, points ) {
        context.moveTo( x + points[0].x, y + points[0].y );

        context.beginPath();
        var px, py;
        for( var k = 0, len = points.length; k < len; k++ ) {
            px = x + points[k].x;
            py = y + points[k].y;
            context.lineTo( px, py );
        }
        for( var k = points.length-1; k >= 0; k-- ) {
            px = x - points[k].x;
            py = y + points[k].y;
            context.lineTo( px, py );
        }
        context.closePath();

        context.stroke();
        context.fill();
    },

    regular: function( context, x, y, radius, sides ) {
        if( sides < 3 ) return;
        var a = (Math.PI*2) / sides;

        context.save();
        context.translate( x, y );

        context.beginPath();
        context.moveTo( radius, 0 );
        for( var i = 1; i < sides; i++ ) {
            context.lineTo( radius*Math.cos( a*i ), radius*Math.sin( a*i ) );
        }
        context.closePath();

        context.stroke();
        context.fill();

        context.restore();
    },

    irregular: function( context, x, y, radius, sides, noise ) {
        if( sides < 3 ) return;
        var a = (Math.PI*2) / sides;

        context.save();
        context.translate( x, y );

        context.beginPath();
        context.moveTo( radius, 0 );
        var nx, ny;
        for( var i = 1; i < sides; i++ ) {
            nx = (Math.random()*noise) - (noise*.5);
            ny = (Math.random()*noise) - (noise*.5);
            context.lineTo( (radius+nx)*Math.cos( a*i ), (radius+ny)*Math.sin( a*i ) );
        }
        context.closePath();

        context.stroke();
        context.fill();

        context.restore();
    }

});