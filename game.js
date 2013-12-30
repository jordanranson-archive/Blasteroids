CanvasRenderingContext2D.prototype.regularPolygon = function(x, y, radius, sides) {
    if (sides < 3) return;

    this.beginPath();
    var a = ((Math.PI * 2)/sides);
    this.translate(x, y);
    this.moveTo(radius,0);
    for (var i = 1; i < sides; i++) {
        this.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
    }
    this.closePath();
};

Game = function() {
    this.canvas = $('#canvas')[0];
    this.context = this.canvas.getContext('2d');
    this.input = null;
    this.shipBuilder = new ShipBuilder();
    this.screen = {x: 0, y: 0};
    this.playername = 'anonymous';

    this._scalar = 10;

    this.entities = [];
    this.entityCanvas = {};

    /*

    {   
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
                points: [
                    {x: 0, y: 0}
                ],
                color: '#fff'
            }
        ],
        reactorPos: 0,
        reactorColor: '#fff'
    }

    */

    this.init = function() {
        this.initSocket();
        this.initDOM();

        this.input = new Input();

        this.resize();
    };

    this.initSocket = function() {
        var self = this;

        /*var player = {
            name: prompt("What's your name?", 'Anonymous'+((new Date()).getTime()>>4).toString(16)),
            type: 'player',
            pos: {x: 0, y: 0},
            last: {x: 0, y: 0},
            vel: {x: 0, y: 0},
            speed: 0.25, // divide by 100 - meters per second
            angle: 0,
            radius: 48,
            alive: true,
            shapes: [
                {
                    points: [
                        {x: 0, y: 0}
                    ],
                    color: '#fff'
                }
            ]
        };
        this.playername = player.name;
        socket.emit('join', player);
        $('.chat input').removeAttr('disabled');
        */

        socket.on('updateentities', function (entities) {
            self.entities = entities;
        });

        socket.on('updateentity', function (entity) {
            self.entities.update(entity.name, entity);
        });

        socket.on('removeplayer', function (playername) {
            $('.t-'+playername).remove();
        });

        socket.on('updatechat', function (playername, data) {
            var $msg = $('<span class="f"><b>&lt;'+ playername + '&gt;</b> ' + data + '</span><br>');
            var $conversation = $('#conversation');
                $conversation.append($msg);
                $conversation.animate({scrollTop: $conversation.height()}, 100);
            setTimeout(function(){
                $msg.removeClass('f');
            },1);
            setTimeout(function(){
                $msg.addClass('t');
            },5000);
        });
    };

    this.initDOM = function() {
        var self = this;

        $(window).on('resize', this.resize);

        $('#build').click( function() {
            self.shipBuilder.open();
        });

        $('#closePanel').click( function() {
            self.shipBuilder.close();
        });

        $('#datasend').click( function() {
            var message = $('#data').val();
            $('#data').val('');
            socket.emit('sendchat', message);
        });

        $('#data').keypress(function(e) {
            if(e.which == 13) {
                $(this).blur();
                $('#datasend').focus().click();
                $(this).focus();
            }
        });
    };

    this.run = function() {
        var self = this;

        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame   ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        this.resize();
        self.shipBuilder.open();

        (function animloop(){
            requestAnimFrame(animloop);
            self.update();
        })();
    };

    this.update = function() {
        for(var i = 0; i < this.entities.length; i++) {
            if( this.entities[i].type === 'player' ) Player.update( this.entities[i] );
        }

        this.canvas.width = this.canvas.width;
        var $tag;
        for(var i = 0; i < this.entities.length; i++) {
            if( this.entities[i].type === 'player' ) {
                Player.draw( this.entities[i] );

                $tag = $('.t-'+this.entities[i].name);
                if( $tag.length === 0 ) {
                    $tag = $(document.createElement('div'));
                    $tag
                    .addClass('tag')
                    .addClass('t-'+this.entities[i].name)
                    .html(this.entities[i].name)
                    .appendTo('body');
                } else {
                    $tag
                    .css('top', this.entities[i].pos.y<<0 + 'px')
                    .css('left', ((this.entities[i].pos.x<<0) + this.entities[i].radius - ($tag.width()*.5)) + 'px');
                }
            }
        }
        
        this.shipBuilder.update();
        this.shipBuilder.draw();
    };

    this.resize = function() {
        var $elem = $(window);
        $(this.canvas)
        .attr('width', $elem.width())
        .attr('height', $elem.height());

        $elem = $('.active-side');
        $('#tabPanel canvas')
        .attr('width', $elem.width())
        .attr('height', $elem.height());
    };

    this.init();
};