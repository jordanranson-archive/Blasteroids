var global = {};
var verbose = true;

function log() {
    if( verbose && typeof console === 'object' ) {
        var msg = '';
        for( var i = 0; i < arguments.length; i++ ) {
            msg += arguments[i] + ' ';
        }
        console.log( msg );
    }
}

window.onload = function() {


    var queuedScripts = [];

    // Recursively loads JavaScript files
    function load(callback, index) {

        // First iteration of loop
        if( index === undefined ) index = 0;

        // Done loading all scripts so fire callback
        if( queuedScripts.length === index ) {
            log('done loading!');
            callback();
            return;
        }

        log('loading...', queuedScripts[index]);

        // Adding the script tag to the head as suggested before
        var url = queuedScripts[index];
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Load the next script once the current one is complete
        script.onload = function() {
            load(callback, index+1);
        };

        // Fire load
        head.appendChild(script);
    }

    // Add a script to the queue
    function require(url) {
        queuedScripts.push(url);
    }


    /*
     * Include dependencies
     */

    // Third party
    require('client/vendor/zepto.js');
    require('client/vendor/socket.io.js');

    // Constants
    require('lib/constants.js');
    require('lib/key.js');

    // Core
    require('lib/util.js');
    require('lib/class.js');
    require('client/draw.js');
    require('client/input.js');
    require('client/camera.js');
    require('client/game.js');

    // Objects
    require('lib/entity.js');
    require('lib/entities/player.js');
    require('client/entities/player.js');


    // Start the game
    load(function() {
        var game = new global.Game();
        game.run();
    });


};