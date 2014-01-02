global.Entity = global.Class.extend({

    pos: { x: 0, y: 0 },
    last: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    size: { x: 0, y: 0 },

    angle: 0,
    maxVel: 1000,
    speed: .1,
    friction: .997,

    id: 0,
    name: '',
    className: 'Entity',
    clientClassName: 'Entity',

    lastUpdate: 0,

    shapes: [],

    init: function( id, settings ) {

        // Set id 
        this.id = id;

        // Extend properties from settings
        this.updateEntity( Date.now(), settings );
    },

    bindSockets: function( socket ) {

    },

    update: function( time ) {

        // Difference between last update and current time
        var delta = time - this.lastUpdate;
        if( delta <= 0 ) return;

        // clamp velocity
        if( this.vel.x >  this.maxVel ) this.vel.x =  this.maxVel;
        if( this.vel.x < -this.maxVel ) this.vel.x = -this.maxVel;
        if( this.vel.y >  this.maxVel ) this.vel.y =  this.maxVel;
        if( this.vel.y < -this.maxVel ) this.vel.y = -this.maxVel;

        // update position
        this.pos.x += (this.vel.x * delta) * .001;
        this.pos.y += (this.vel.y * delta) * .001;

        // collision
        this.collide( delta );

        // decay velocity
        //var friction = Math.pow( this.friction, delta );
        //this.vel.x *= friction;
        //this.vel.y *= friction;

        // new last position
        this.last.x = this.pos.x;
        this.last.y = this.pos.y;

        // new update time
        this.lastUpdate = Date.now();
    },

    collide: function( delta ) {
        
    },

    updateEntity: function( time, settings ) {
        for( var key in settings ) {

            // Update objects
            if( typeof this[key] === 'object' ) {
                for( var k in settings[key] ) {
                    this[key][k] = settings[key][k];
                }
            }

            // Update everything else
            else if( typeof this[key] !== 'function' ) {
                this[key] = settings[key];
            }
        }
        
        //this.update( time );
    },

    serialize: function() {
        return {
            pos: this.pos,
            last: this.last,
            vel: this.vel,
            size: this.size,

            angle: this.angle,
            maxVel: this.maxVel,
            speed: this.speed,
            friction: this.friction,

            id: this.id,
            name: this.name,
            className: this.className,
            clientClassName: this.clientClassName,

            lastUpdate: this.lastUpdate,

            shapes: this.shapes
        };
    },

    draw: function() {},

    handleInput: function() {}

});