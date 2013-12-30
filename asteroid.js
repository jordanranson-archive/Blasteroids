Asteroid = {};

Asteroid.collide = function(entity) {

};

Asteroid.update = function(entity) {

};

Asteroid.draw = function(entity) {
    if( !entity.alive ) return;

    // render ship and cache the context
    if( !(entity.name in game.entityCanvas) ) {
        game.entityCanvas[entity.name] = Player.render(entity);
    }

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
    context.arc(0,0,entity.radius,0,2*Math.PI);
    context.stroke();
    context.closePath();

    // context.lineWidth = 2;
    // context.lineJoin = 'bevel';
    // for ( i = 0; i < entity.shapes.length; i++ ) {
    //     context.beginPath();
    //     context.strokeStyle = entity.shapes[i].color;

    //     context.moveTo(entity.radius+(entity.shapes[i].points[0].x*game._scalar), entity.radius+(entity.shapes[i].points[0].y*game._scalar));
    //     for( var k = 0; k < entity.shapes[i].points.length; k++ ) {
    //         x = entity.radius+(entity.shapes[i].points[k].x*game._scalar);
    //         y = entity.radius+(entity.shapes[i].points[k].y*game._scalar);
    //         context.lineTo(x, y);
    //     }
    //     for( var k = entity.shapes[i].points.length-1; k >= 0; k-- ) {
    //         x = entity.radius+((entity.shapes[i].points[k].x*game._scalar)*-1);
    //         y = entity.radius+(entity.shapes[i].points[k].y*game._scalar);
    //         context.lineTo(x, y);
    //     }
    //     context.stroke();
    // }

    context.restore();
};