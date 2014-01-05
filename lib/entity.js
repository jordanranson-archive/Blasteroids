global.Entity = global.Class.extend({

    pos: { x: new Big(0), y: new Big(0) },
    last: { x: new Big(0), y: new Big(0) },
    vel: { x: new Big(0), y: new Big(0) },
    size: { x: 0, y: 0 },

    angle: 0,
    maxVel: 1000,
    rawSpeed: 50,
    rotationSpeed: 1,
    friction: new Big('.997'),

    speed: new Big('.05'),

    id: 0,
    name: '',
    className: 'Entity',
    clientClassName: 'Entity',

    lastUpdate: 0,

    inputState: {},

    shapes: [],

    init: function( id, settings ) {

        // Set id 
        this.id = id;

        // Extend properties from settings
        if( settings.lastUpdate === undefined ) this.lastUpdate = Date.now();
        this.updateEntity( settings );
    },

    update: function( time ) {

        // Difference between last update and current time
        var delta = time - this.lastUpdate;
        if( delta <= 0 ) return;

        var ticks = delta;
        while( ticks-- ) {

            // clamp velocity
            if( this.vel.x.gt(  this.maxVel ) ) this.vel.x = new Big(  this.maxVel );
            if( this.vel.x.lt( -this.maxVel ) ) this.vel.x = new Big( -this.maxVel );
            if( this.vel.y.gt(  this.maxVel ) ) this.vel.y = new Big(  this.maxVel );
            if( this.vel.y.lt( -this.maxVel ) ) this.vel.y = new Big( -this.maxVel );

            // update position
            this.pos.x = new Big( this.pos.x.plus( this.vel.x ) );
            this.pos.y = new Big( this.pos.y.plus( this.vel.y ) );

            // update event callback
            this.onUpdate();

            // collision
            this.collide( delta );

            // decay velocity
            // var friction = this.friction;
            // this.vel.x *= friction;
            // this.vel.y *= friction;

            // new last position
            this.last.x = new Big( this.pos.x );
            this.last.y = new Big( this.pos.y );
        }

        // new update time
        this.lastUpdate = Date.now();
    },

    onUpdate: function() {},

    collide: function( delta ) {
        
    },

    updateEntity: function( settings ) {
        for( var key in settings ) {
            if( key === 'pos' || key === 'last' || key === 'vel' ) {
                this[key].x = new Big(settings[key].x);
                this[key].y = new Big(settings[key].y);
            }
            else if( key === 'friction' ) {
                this[key] = new Big(settings[key]);
            }
            else if( typeof this[key] !== 'function' ) {
                this[key] = settings[key];
            }
        }

        this.speed = new Big( Big(this.rawSpeed).div(1000).div(15) );
    },

    serialize: function() {
        return {
            pos: { x: this.pos.x.toFixed(10).toString(), y: this.pos.y.toFixed(10).toString() },
            last: { x: this.last.x.toFixed(10).toString(), y: this.last.y.toFixed(10).toString() },
            vel: { x: this.vel.x.toFixed(10).toString(), y: this.vel.y.toFixed(10).toString() },
            size: this.size,

            angle: this.angle,
            maxVel: this.maxVel,
            rawSpeed: this.rawSpeed,
            friction: this.friction.toFixed(10).toString(),

            id: this.id,
            name: this.name,
            className: this.className,
            clientClassName: this.clientClassName,

            lastUpdate: this.lastUpdate,

            inputState: this.inputState,

            shapes: this.shapes
        };
    },

    draw: function() {},

    handleInput: function() {}

});