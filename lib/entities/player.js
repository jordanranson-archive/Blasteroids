global.Player = global.Entity.extend({

    size: { x: 100, y: 100 },

    className: 'Player',
    clientClassName: 'PlayerClient',

    inputState: {},

    shapes: [
        {
            points: [
                // default fuselage
                // start and end x must be 0
                {x: 0, y: -4},
                {x: -1, y: -4},
                {x: -2, y: -3},
                {x: -2, y: -1},
                {x: -1, y: 0},
                {x: 0, y: 0},
                {x: -2, y: 0},
                {x: -2, y: 1},
                {x: 0, y: 1}
            ],
            color: '#666666'
        },
        {
            points: [
                // default engine
                // start and end x must be 0
                {x: 0, y: 1},
                {x: -1, y: 1},
                {x: -1, y: 2},
                {x: -2, y: 3},
                {x: -2, y: 5},
                {x: 0, y: 5},
                {x: -1, y: 4},
                {x: 0, y: 4}
            ],
            color: '#ff0000'
        },
        {
            points: [
                // default weapons
                // start and end x must be within ship hitbox
                {x: -1, y: 0},
                {x: -2, y: -1},
                {x: -3, y: -1},
                {x: -5, y: 1},
                {x: -2, y: 1},
                {x: -1, y: 0}
            ],
            color: '#cccc00'
        }
    ],

    onUpdate: function() {

        var angle = Math.radians(this.angle);
        var speed = this.speed.toFixed(10);

        // Move forward
        if( this.inputState.forward ) {
            this.vel.x = new Big( this.vel.x.plus( Math.cos(angle)*speed ) );
            this.vel.y = new Big( this.vel.y.plus( Math.sin(angle)*speed ) );
        }

        // Move backward
        if( this.inputState.backward ) {
            this.vel.x = new Big( this.vel.x.minus( Math.cos(angle)*(speed*.6) ) );
            this.vel.y = new Big( this.vel.y.minus( Math.sin(angle)*(speed*.6) ) );
        }

        // Turn left
        if( this.inputState.turnLeft ) {
            var rotDelta = this.angle-this.rotationSpeed;
            this.angle = rotDelta < 0 ? 359-(this.angle+(rotDelta)) : rotDelta;
        }

        // Turn right
        if( this.inputState.turnRight ) {
            var rotDelta = this.angle+this.rotationSpeed;
            this.angle = rotDelta > 359 ? this.angle-(360-this.rotationSpeed) : rotDelta;
        }

        // Shoot weapon
        if( this.inputState.shoot ) {
            console.log( 'shoot' );
        }

        // Use ability
        if( this.inputState.ability ) {
            console.log( 'ability' );
        }

        // Switch ability
        if( this.inputState.switchAbility ) {
            console.log( 'switchAbility' );
        }

        // Clear input state
        this.inputState = {};
    }
    
})