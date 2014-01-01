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

        log('loading...', queuedScripts[index]+'.js');

        // Adding the script tag to the head as suggested before
        var url = queuedScripts[index] + '.js';
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
    require('client/vendor/zepto');

    // Constants
    require('lib/constants');
    require('lib/key');

    // Core
    require('lib/util');
    require('lib/class');
    require('client/draw');
    require('client/input');
    require('client/camera');
    require('client/game');

    // Objects
    require('lib/entity');


    // Start the game
    load(function() {
        var game = new global.Game();
        game.run();
    });


};