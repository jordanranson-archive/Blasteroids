ShipBuilder = function() {
    this.isOpen = false;

    this.$container = $('#wrapper');

    this.canvas = [
        $('#grid')[0],
        $('#fuselage')[0],
        $('#engine')[0],
        $('#weapons')[0],
        $('#reactor')[0]
    ];

    this.context = [
        this.canvas[0].getContext('2d'),
        this.canvas[1].getContext('2d'),
        this.canvas[2].getContext('2d'),
        this.canvas[3].getContext('2d'),
        this.canvas[4].getContext('2d')
    ];

    this.paths = [
        [],
        [],
        [],
        [],
        []
    ];

    this.init = function() {
        this.$container.hide();

        $('#shipTabs li').on('click', function(){
            $('#shipTabs li').removeClass('active');
            $(this).addClass('active');

            var tab = $(this).data('for');
            if( tab === 'reactor' ) {
                $('#panelReactor').show();
            } else {
                $('#panelReactor').hide();

                if( tab === 'fuselage' ) {

                }
                if( tab === 'engine' ) {

                }
                if( tab === 'weapons' ) {
                    
                }
            }
        })

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

        // update
    };

    this.draw = function() {
        if( !this.isOpen ) return;

        // draw grid
        var i, x, y;
        for( i = 0; i < this.paths[0].length; i++ ) {
            x = this.paths[0][i].x;
            y = this.paths[0][i].y;
            this.context[0].fillStyle = '#333';
            this.context[0].fillRect(x, y, 1, 1);
        }
    };

    this.init();
}