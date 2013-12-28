Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

Array.prototype.find = function(name) {
    for( var i = 0; i < this.length; i++ ) {
        if( this[i].name === name ) {
            return this[i];
        }
    }

    return -1;
};

Array.prototype.indexOfName = function(name) {
    var object = this.find(name);
    return object === -1 ? -1 : this.indexOf(object);
};

Array.prototype.remove = function(name) {
    var index = this.indexOfName(name);
    if( index !== -1 ) this.splice(index, 1);
};

Array.prototype.update = function(name, data) {
    this[this.indexOf(this.find(name))] = data;
};