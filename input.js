Input = function() {

    var keys = [];
    var prev = 0;
    
    this.init = function() {
        $(document).on('keydown', this.keydown);
        $(document).on('keyup', this.keyup);
    };

    this.keydown = function(evt) {
        if( evt.keyCode === prev && keys[evt.keyCode] !== undefined ) return false;
        else prev = evt.keyCode;

        if(!$('input').is(":focus")) keys[evt.keyCode] = -1;
    };

    this.keyup = function(evt) {
        prev = 0;
        delete keys[evt.keyCode];
    };

    this.pressed = function(key) {
        var result = keys[key] === -1;
        keys[key] = 1;

        return result;
    };

    this.state = function(key) {
        return keys[key] !== undefined;
    };

    this.update = function() {
        for(var i = 0; i < keys.length; i++) {
            if(keys[i] === -1) {
                keys[i] = 1;
            }
        }
    };

    this.init();
}