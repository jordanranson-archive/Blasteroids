global.Entity = global.Class.extend({

    pos: { x: 0, y: 0 },
    last: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },

    angle: 0,
    maxVel: 3,
    speed: .1,
    friction: .997,

    id: 0,
    name: '',
    className: 'Entity',
    clientClassName: 'Entity',

    lastUpdate: 0,

    events: {},

    init: function( id, settings ) {

        // Set id 
        this.id = id;

        // Hook up socket events
        for( var key in this.events ) {
            //global.game.socket.on( key, this[this.events[key]] );
        }

        // Extend properties from settings
        this.updateEntity( Date.now(), settings );
    },

    update: function( time ) {

        // Difference between last update and current time
        var delta = time - this.lastUpdate;

        // clamp velocity
        if( this.vel.x >  this.maxVel ) this.vel.x =  this.maxVel;
        if( this.vel.x < -this.maxVel ) this.vel.x = -this.maxVel;
        if( this.vel.y >  this.maxVel ) this.vel.y =  this.maxVel;
        if( this.vel.y < -this.maxVel ) this.vel.y = -this.maxVel;

        // update position
        this.pos.x += this.vel.x * delta;
        this.pos.y += this.vel.y * delta;

        // collision
        this.collide( delta );

        // decay velocity
        this.vel.x *= this.friction * delta;
        this.vel.y *= this.friction * delta;

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
        
        this.update( time );
    },

    serialize: function() {
        return {
            pos: this.pos,
            last: this.last,
            vel: this.vel,

            angle: this.angle,
            maxVel: this.maxVel,
            speed: this.speed,
            friction: this.friction,

            id: this.id,
            name: this.name,
            className: this.className,
            clientClassName: this.clientClassName,

            lastUpdate: this.lastUpdate
        };
    },

    draw: function() {},

    handleInput: function() {}

});