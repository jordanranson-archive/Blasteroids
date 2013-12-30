Projectile = {};

Projectile.collide = function(entity) {
    var x = -entity.radius, 
        y = -entity.radius-(game._scalar*.5);

    // -
}

Projectile.update = function(entity) {
    if( !entity.alive ) return entity;

    // accellerate
    entity.vel.x = Math.cos(Math.radians(entity.angle))*(5+entity.speed);
    entity.vel.y = Math.sin(Math.radians(entity.angle))*(5+entity.speed);

    // update position
    entity.pos.x += entity.vel.x;
    entity.pos.y += entity.vel.y;

    // decay velocity
    entity.vel.x *= .995;
    entity.vel.y *= .995;

    // send to server
    if( entity.pos.x<<0 !== entity.last.x<<0 || entity.pos.y<<0 !== entity.last.y<<0 ) {
        socket.emit('updateentity', entity);
    }

    // new last position
    entity.last.x = entity.pos.x;
    entity.last.y = entity.pos.y;

    if( (new Date()).getTime() > entity.spawned + 750 ) {
        entity.alive = false;
    }

    return entity;
};

Projectile.draw = function(entity) {
    if( !entity.alive ) return;

    game.context.save();

    game.context.translate(entity.pos.x, entity.pos.y);
    game.context.translate(entity.radius, entity.radius);
    game.context.rotate(Math.radians(entity.angle+90));

    // draw regular projectile
    if( entity.tech === 'none' ) {
        game.context.beginPath();
        game.context.globalAlpha = 0.35;
        game.context.fillStyle = entity.color;
        game.context.arc(0,0,4,0,2*Math.PI);
        game.context.fill();
        game.context.closePath();

        game.context.beginPath();
        game.context.globalAlpha = 1;
        game.context.arc(0,0,2,0,2*Math.PI);
        game.context.fill();
    }

    game.context.restore();
};