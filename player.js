Player = {};

Player.update = function(entity) {
    if( !entity.alive ) return entity;

    // handle input
    if( entity.name === game.playername ) {

        // movement
        if( game.input.state(Key.w) ) {
            entity.vel.x += Math.cos(Math.radians(entity.angle))*entity.speed;
            entity.vel.y += Math.sin(Math.radians(entity.angle))*entity.speed;
        }
        if( game.input.state(Key.s) ) {
            entity.vel.x -= Math.cos(Math.radians(entity.angle))*entity.speed;
            entity.vel.y -= Math.sin(Math.radians(entity.angle))*entity.speed;
        }

        // rotation
        var rotationSpeed = 3;
        if( game.input.state(Key.a) ) {
            entity.angle = entity.angle-rotationSpeed<0?359:entity.angle-rotationSpeed;
        }
        if( game.input.state(Key.d) ) {
            entity.angle = entity.angle+rotationSpeed>359?0:entity.angle+rotationSpeed;
        }

        // abilities
        if( game.input.pressed(Key.space) ) {
            console.log('attack')
        }
    }

    // update position
    entity.pos.x += entity.vel.x;
    entity.pos.y += entity.vel.y;

    // decay velocity
    entity.vel.x *= .99;
    entity.vel.y *= .99;

    // send to server
    if( entity.pos.x<<0 !== entity.last.x<<0 || entity.pos.y<<0 !== entity.last.y<<0 ) {
        socket.emit('updateentity', entity);
    }

    // new last position
    entity.last.x = entity.pos.x;
    entity.last.y = entity.pos.y;

    return entity;
};

Player.render = function(entity) {
    var canvas = document.createElement('canvas');
        canvas.width = entity.radius*2;
        canvas.height = entity.radius*2;

    var context = canvas.getContext('2d');

    var points = [
        {x: 48, y: 92},
        {x: 12, y: 92},
        {x: 48, y: 4},
        {x: 84, y: 92},
        {x: 48, y: 92}
    ];

    var options = {
        color: game.playername===entity.name?'#8cc152':'#777',
        width: 2
    };

    context.save();

    context.strokeStyle = options.color;
    context.lineWidth = options.width;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for(var i = 0; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();

    context.restore();

    return canvas;
};

Player.draw = function(entity) {
    if( !entity.alive ) return;

    // render ship and cache the context
    if( !(entity.name in game.entityCanvas) ) {
        game.entityCanvas[entity.name] = Player.render(entity);
    }

    game.context.save();

    game.context.translate(entity.pos.x, entity.pos.y);
    game.context.translate(entity.radius, entity.radius);
    game.context.rotate(Math.radians(entity.angle+90));

    game.context.drawImage(game.entityCanvas[entity.name], -entity.radius, -entity.radius);

    game.context.restore();
};