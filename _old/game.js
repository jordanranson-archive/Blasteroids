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
    this.shipBuilder = null;
    this.playername = 'anonymous';
    this.universe = {};

    this.camera = {x: 0, y: 0};

    this._scalar = 10;

    this.entities = [];
    this.entityCanvas = {};

    this.init = function() {
        this.initSocket();
        this.initDOM();

        this.input = new Input();

        this.resize();
    };

    this.initSocket = function() {
        var self = this;

        socket.on('aboutuniverse', function(universe) {
            self.universe = universe;
            self.camera.x = universe.size*.5;
            self.camera.y = universe.size*.5;

            self.shipBuilder = new ShipBuilder();
            self.shipBuilder.open();
        });

        socket.on('joined', function() {
            setInterval(function() {
                socket.emit('ping', self.playername);
            }, 7500);
        });

        socket.on('updateentities', function (entities) {
            self.entities = entities;
        });

        socket.on('updateentity', function (entity) {
            self.entities.update(entity.name, entity);
        });

        socket.on('spawnentity', function (entity, index) {
            self.entities.splice(index, 0, entity);
        });

        socket.on('removeentity', function (name) {
            self.entities.remove(name);
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

        (function animloop(){
            requestAnimFrame(animloop);
            self.update();
        })();
    };

    this.update = function() {


        // update entities
        for(var i = 0; i < this.entities.length; i++) {
            if( !this.entities[i].alive ) {
                socket.emit('removeentity', this.entities[i].name);
            }

            if( this.entities[i].type === 'player' ) Player.update( this.entities[i] );
            if( this.entities[i].type === 'projectile' ) Projectile.update( this.entities[i] );
        }


        // draw
        this.canvas.width = this.canvas.width;

        var offsetx = -game.camera.x + ($(window).width()*.5),
            offsety = -game.camera.y + ($(window).height()*.5);
        game.context.translate( offsetx, offsety );

        // draw universe info
        if( this.universe.size ) {

            // grid
            this.context.fillStyle = '#333';
            var w = (this.universe.size / (game._scalar*5)) << 0;
            for(var x = 0; x < w; x++) {
                for(var y = 0; y < w; y++) {
                    this.context.fillRect(x*(game._scalar*5), y*(game._scalar*5), 1, 1);
                }
            }

            // border
            this.context.strokeStyle = '#555';
            this.context.lineWidth = 4;
            this.context.rect(0,0,this.universe.size,this.universe.size);
            this.context.stroke();
        }


        // draw entities
        var $tag;
        for(var i = 0; i < this.entities.length; i++) {

            var h = this.entities[i].pos.y<<0;
                h += offsety;
            var w = (this.entities[i].pos.x<<0) + this.entities[i].radius;
                w += offsetx;

            // draw player
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
                    .css('top', h + 'px')
                    .css('left', (w - ($tag.width()*.5)) + 'px');
                }
            }

            // draw projectile
            if( this.entities[i].type === 'projectile' ) {
                Projectile.draw( this.entities[i] );
            }

            // draw asteroids
            if( this.entities[i].type === 'asteroid' ) {
                Asteroid.draw( this.entities[i] );
            }
        }
        

        // ship builder update and draw
        if( this.shipBuilder ) {
            this.shipBuilder.update();
            this.shipBuilder.draw();
        }
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

    this.spawnEntity = function(entity) {
        /*if(settings) $.extend(entity, settings);
        entity.pos.x = x;
        entity.pos.y = y;*/

        socket.emit('spawnentity', entity);

        return entity;
    };

    this.init();
};