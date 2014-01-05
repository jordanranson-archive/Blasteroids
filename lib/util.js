/* 
 * Math utilities
 */

Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};


/* 
 * Array utilities
 */

Array.prototype.find = function(key, value) {
    for( var i in this ) {
        if( this[i][key] === value ) {
            return this[i];
        }
    }

    return -1;
};

Array.prototype.indexAt = function(key, value) {
    var object = this.find(key, value);
    return object === -1 ? -1 : this.indexOf(object);
};

Array.prototype.remove = function(id) {
    var index = this.indexAt('id', id);
    if( index !== -1 ) this.splice(index, 1);

    return index;
};


/* 
 * String utilities
 */

String.prototype.brightness = function( percent ) {   
    var num = parseInt(this.slice(1),16), 
        amt = Math.round(2.55 * percent), 
        R = (num >> 16) + amt, 
        G = (num >> 8 & 0x00FF) + amt, 
        B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
};

String.randomColor = function( b ) {
    var r = ((Math.random()*(256-b)<<0)+b).toString(16),
        g = ((Math.random()*(256-b)<<0)+b).toString(16),
        b = ((Math.random()*(256-b)<<0)+b).toString(16);
    if( r.length === 1 ) r += '0';
    if( g.length === 1 ) g += '0';
    if( b.length === 1 ) b += '0';

    return '#'+r+g+b;
};


/* 
 * Object utilities
 */

Object.copy = function( object ) {
    if(
       !object || typeof(object) != 'object' ||
       object instanceof global.Class
    ) {
        return object;
    }
    else if( object instanceof Array ) {
        var c = [];
        for( var i = 0, l = object.length; i < l; i++) {
            c[i] = Object.copy(object[i]);
        }
        return c;
    }
    else {
        var c = {};
        for( var i in object ) {
            c[i] = Object.copy(object[i]);
        }
        return c;
    }
};

Object.merge = function( original, extended ) {
    for( var key in extended ) {
        var ext = extended[key];
        if(
            typeof(ext) != 'object' ||
            ext instanceof global.Class ||
            ext === null
        ) {
            original[key] = ext;
        }
        else {
            if( !original[key] || typeof(original[key]) != 'object' ) {
                original[key] = (ext instanceof Array) ? [] : {};
            }
            original[key] = Object.merge( original[key], ext );
        }
    }
    return original;
};