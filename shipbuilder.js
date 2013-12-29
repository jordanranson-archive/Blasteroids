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

    this.grid = [];

    this.player = {   
        name: 'anonymous',
        type: 'player',
        pos: {x: 0, y: 0},
        last: {x: 0, y: 0},
        vel: {x: 0, y: 0},
        speed: 0,
        angle: 0,
        radius: 0,
        alive: true,
        shapes: [
            {
                // default fuselage
                // start and end x must be 0
                points: [
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
                color: '#777'
            },
            {
                points: [
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
                color: $('#color2').val()
            },
            {
                points: [
                    // default weapons
                    // start and end x must be within ship hitbox
                    {x: -1, y: 0},
                    {x: -2, y: -1},
                    {x: -3, y: -1},
                    {x: -5, y: 1},
                    {x: -2, y: 1},
                    {x: -1, y: 0}
                ],
                color: $('#color').val()
            }
        ],
        reactorPos: -2,
        reactorColor: $('#accent').val()
    };

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

        var $select = $('#loadPlayername');
        for( var name in localStorage ) {
            $('<option value="'+name+'">'+name+'</option>').appendTo($select);
        }

        var width = (this.$container.width()/20)<<0;
        var height = (this.$container.height()/20)<<0;

        // generate grid
        for( var x = 0; x < width; x++ ) {
            for( var y = 0; y < height; y++ ) {
                this.grid.push({ x: x*20, y: y*20 });
            }
        }

        $('#closePanel').on('click', function() {
            self.buildShip();
        });

        $('#save').on('click', function() {
            self.savePlayer( self.generatePlayer() );
        });

        $('#load').on('click', function() {
            self.loadPlayer();
        });
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

    this.savePlayer = function(player) {
        localStorage.setItem( player.name, JSON.stringify(player) );

        var $select = $('#loadPlayername');
        $select.html('');
        for( var name in localStorage ) {
            $('<option value="'+name+'">'+name+'</option>').appendTo($select);
        }

        console.log( 'save', player );
    };

    this.loadPlayer = function() {
        var player = JSON.parse( localStorage.getItem($('#loadPlayername').val()) );
        this.player = player;

        console.log( 'load', this.player );
    };

    this.generatePlayer = function() {
        var player = {   
            name: $('#name').val(),
            type: 'player',
            pos: {x: 0, y: 0},
            last: {x: 0, y: 0},
            vel: {x: 0, y: 0},
            speed: this.player.speed,
            angle: 0,
            radius: this.player.radius,
            alive: true,
            shapes: [
                {
                    points: this.player.shapes[0].points,
                    color: '#666'
                },
                {
                    points: this.player.shapes[1].points,
                    color: $('#color2').val()
                },
                {
                    points: this.player.shapes[2].points,
                    color: $('#color').val()
                }
            ],
            reactorPos: this.player.reactorPos,
            reactorColor: $('#accent').val()
        };

        console.log( 'generate', player );
        return player;
    };

    this.buildShip = function() {

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
        for( i = 0; i < this.grid.length; i++ ) {
            x = this.grid[i].x;
            y = this.grid[i].y;
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

        this.context[1].moveTo(w+(this.player.shapes[0].points[0].x*20), h+(this.player.shapes[0].points[0].y*20));
        for( i = 0; i < this.player.shapes[0].points.length; i++ ) {
            x = w+(this.player.shapes[0].points[i].x*20);
            y = h+(this.player.shapes[0].points[i].y*20);
            this.context[1].lineTo(x, y);
        }
        for( i = this.player.shapes[0].points.length-2; i >= 0; i-- ) {
            x = w+(this.player.shapes[0].points[i].x*20)*-1;
            y = h+(this.player.shapes[0].points[i].y*20);
            this.context[1].lineTo(x, y);
        }
        this.context[1].stroke();


        /*
         * draw engine
         */

        this.context[2].beginPath();
        this.context[2].strokeStyle = $('#color2').val();
        this.context[2].lineWidth = 2;
        this.context[2].lineJoin = 'bevel';

        this.context[2].moveTo(w+(this.player.shapes[1].points[0].x*20), h+(this.player.shapes[1].points[0].y*20));
        for( i = 0; i < this.player.shapes[1].points.length; i++ ) {
            x = w+(this.player.shapes[1].points[i].x*20);
            y = h+(this.player.shapes[1].points[i].y*20);
            this.context[2].lineTo(x, y);
        }
        for( i = this.player.shapes[1].points.length-2; i >= 0; i-- ) {
            x = w+(this.player.shapes[1].points[i].x*20)*-1;
            y = h+(this.player.shapes[1].points[i].y*20);
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

        this.context[3].moveTo(w+(this.player.shapes[2].points[0].x*20), h+(this.player.shapes[2].points[0].y*20));
        for( i = 0; i < this.player.shapes[2].points.length; i++ ) {
            x = w+(this.player.shapes[2].points[i].x*20);
            y = h+(this.player.shapes[2].points[i].y*20);
            this.context[3].lineTo(x, y);
        }
        this.context[3].stroke();

        this.context[3].beginPath();
        for( i = this.player.shapes[2].points.length-1; i >= 0; i-- ) {
            x = w+(this.player.shapes[2].points[i].x*20)*-1;
            y = h+(this.player.shapes[2].points[i].y*20);
            this.context[3].lineTo(x, y);
        }
        this.context[3].stroke();


        /* 
         * draw reactor cores
         */

        y = this.player.reactorPos*20;

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