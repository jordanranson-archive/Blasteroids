Game = function() {
    this.canvas = $('#canvas')[0];
    this.context = this.canvas.getContext('2d');
    this.input = null;
    this.screen = {x: 0, y: 0};
    this.playername = 'anonymous';

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
        ]
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

        var player = {
            name: prompt("What's your name?", 'Anonymous'+((new Date()).getTime()>>4).toString(16)),
            type: 'player',
            pos: {x: 0, y: 0},
            last: {x: 0, y: 0},
            vel: {x: 0, y: 0},
            speed: 0.25,
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

        socket.on('updateentities', function (entities) {
            self.entities = entities;
        });

        socket.on('updateentity', function (entity) {
            self.entities.update(entity.name, entity);
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
        $(window).on('resize', this.resize);

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
        for(var i = 0; i < this.entities.length; i++) {
            if( this.entities[i].type === 'player' ) Player.draw( this.entities[i] );
        }
    };

    this.resize = function() {
        var $window = $(window);

        $(this.canvas)
        .attr('width', $window.width())
        .attr('height', $window.height())
    };

    this.init();
};