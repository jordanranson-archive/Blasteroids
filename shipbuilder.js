ShipBuilder = function() {
    this.isOpen = false;
    this.color = '';
    this.accent = '';
    this.coreRotation = 0;

    this.$container = $('#wrapper');

    this.context = [
        $('#grid')[0].getContext('2d'),
        $('#fuselage')[0].getContext('2d'),
        $('#engine')[0].getContext('2d'),
        $('#weapons')[0].getContext('2d'),
        $('#reactor')[0].getContext('2d')
    ];

    this.paths = [
        [],
        [   // default fuselage
            // start and end x must be 0
            {x: 0, y: -4},
            {x: -1, y: -4},
            {x: -2, y: -3},
            {x: -2, y: -1},
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: -2, y: 0},
            {x: -2, y: 1},
            {x: 0, y: 1}
        ],
        [
            // default engine
            // start and end x must be 0
            {x: 0, y: 1},
            {x: -1, y: 1},
            {x: -1, y: 2},
            {x: -2, y: 3},
            {x: -2, y: 5},
            {x: 0, y: 5},
            {x: -1, y: 4},
            {x: 0, y: 4}
        ],
        [
            // default weapons
            // start and end x must be within ship hitbox
            {x: -1, y: 0},
            {x: -2, y: -1},
            {x: -3, y: -1},
            {x: -5, y: 1},
            {x: -2, y: 1},
            {x: -1, y: 0}
        ],
        [{x: 0, y: -2}]
    ];

    this.init = function() {
        var self = this;
        this.$container.hide();

        $('#shipTabs li').on('click', function(){
            $('#shipTabs li').removeClass('active');
            $(this).addClass('active');

            var tab = $(this).data('for');
            if( tab === 'reactor' ) {
                $('#panelReactor').show();
                self.$container
                .find('canvas:not(#grid)')
                .css('opacity', '1');
            } else {
                $('#panelReactor').hide();
                self.$container
                .find('canvas:not(#grid)')
                .css('opacity', '.2');

                if( tab === 'fuselage' ) {
                    $('#fuselage').css('opacity', '1');
                }
                if( tab === 'engine' ) {
                    $('#engine').css('opacity', '1');
                }
                if( tab === 'weapons' ) {
                    $('#weapons').css('opacity', '1');
                }
            }
        });

        $('#tabFuselage').click();

        var width = (this.$container.width()/20)<<0;
        var height = (this.$container.height()/20)<<0;

        // generate grid
        for( var x = 0; x < width; x++ ) {
            for( var y = 0; y < height; y++ ) {
                this.paths[0].push({ x: x*20, y: y*20 });
            }
        }
    };

    this.open = function() {
        this.isOpen = true;
        this.$container.show();
        game.resize();
    };

    this.close = function() {
        this.isOpen = false;
        this.$container.hide();
    };

    this.update = function() {
        if( !this.isOpen ) return;

        this.coreRotation = this.coreRotation+1>359?0:this.coreRotation+1;
    };

    this.draw = function() {
        if( !this.isOpen ) return;

        var i, x, y, w, h;

        this.$container
        .find('canvas')
        .each(function(index) {
            var $this = $(this);
            $this
            .attr('width', $this.width())
            .attr('height', $this.height());
        });

        /*
         * draw grid
         */

        this.context[0].fillStyle = '#333';
        for( i = 0; i < this.paths[0].length; i++ ) {
            x = this.paths[0][i].x;
            y = this.paths[0][i].y;
            this.context[0].fillRect(x, y, 1, 1);
        }


        /*
         * draw fuselage
         */

        w = $('#grid').width()*.5;
        h = $('#grid').height()*.5 + 10;

        this.context[1].beginPath();
        this.context[1].strokeStyle = '#666';
        this.context[1].lineWidth = 2;
        this.context[1].lineJoin = 'bevel';

        this.context[1].moveTo(w+(this.paths[1][0].x*20), h+(this.paths[1][0].y*20));
        for( i = 0; i < this.paths[1].length; i++ ) {
            x = w+(this.paths[1][i].x*20);
            y = h+(this.paths[1][i].y*20);
            this.context[1].lineTo(x, y);
        }
        for( i = this.paths[1].length-2; i >= 0; i-- ) {
            x = w+(this.paths[1][i].x*20)*-1;
            y = h+(this.paths[1][i].y*20);
            this.context[1].lineTo(x, y);
        }
        this.context[1].stroke();


        /*
         * draw engine
         */

        this.context[2].beginPath();
        this.context[2].strokeStyle = $('#color').val().brightness(-20);
        this.context[2].lineWidth = 2;
        this.context[2].lineJoin = 'bevel';

        this.context[2].moveTo(w+(this.paths[2][0].x*20), h+(this.paths[2][0].y*20));
        for( i = 0; i < this.paths[2].length; i++ ) {
            x = w+(this.paths[2][i].x*20);
            y = h+(this.paths[2][i].y*20);
            this.context[2].lineTo(x, y);
        }
        for( i = this.paths[2].length-2; i >= 0; i-- ) {
            x = w+(this.paths[2][i].x*20)*-1;
            y = h+(this.paths[2][i].y*20);
            this.context[2].lineTo(x, y);
        }
        this.context[2].stroke();


        /*
         * draw weapons
         */

        this.context[3].beginPath();
        this.context[3].strokeStyle = $('#color').val();
        this.context[3].lineWidth = 2;
        this.context[3].lineJoin = 'bevel';

        this.context[3].moveTo(w+(this.paths[3][0].x*20), h+(this.paths[3][0].y*20));
        for( i = 0; i < this.paths[3].length; i++ ) {
            x = w+(this.paths[3][i].x*20);
            y = h+(this.paths[3][i].y*20);
            this.context[3].lineTo(x, y);
        }
        this.context[3].stroke();

        this.context[3].beginPath();
        for( i = this.paths[3].length-1; i >= 0; i-- ) {
            x = w+(this.paths[3][i].x*20)*-1;
            y = h+(this.paths[3][i].y*20);
            this.context[3].lineTo(x, y);
        }
        this.context[3].stroke();


        /* 
         * draw reactor cores
         */

        y = this.paths[4][0].y*20;

        this.context[4].save();

        this.context[4].translate(w, h+y);
        this.context[4].rotate(Math.radians(this.coreRotation));

        this.context[4].strokeStyle = $('#accent').val();
        this.context[4].lineWidth = 2;
        this.context[4].regularPolygon(0, 0, 15, 3);
        this.context[4].stroke();

        this.context[4].restore();
    };

    this.init();
}