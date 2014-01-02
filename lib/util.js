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

String.prototype.brightness = function(percent) {   
    var num = parseInt(this.slice(1),16), 
        amt = Math.round(2.55 * percent), 
        R = (num >> 16) + amt, 
        G = (num >> 8 & 0x00FF) + amt, 
        B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
};