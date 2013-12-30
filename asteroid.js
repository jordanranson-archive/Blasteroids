Asteroid = {};

Asteroid.collide = function(entity) {

};

Asteroid.update = function(entity) {

};

Asteroid.draw = function(entity) {
    if( !entity.alive ) return;

    var context = game.context;
    var i, x, y;

    context.save();

    context.translate(entity.pos.x, entity.pos.y);
    context.translate(entity.radius, entity.radius);
    context.rotate(Math.radians(entity.angle+90));


    /*
     * draw entity shapes
     */

    context.beginPath();
    context.globalAlpha = 1;
    context.strokeStyle = '#777777';
    context.lineWidth = 2;

    context.regularPolygon(0, 0, entity.radius, entity.sides);

    context.stroke();
    context.closePath();

    context.restore();
};