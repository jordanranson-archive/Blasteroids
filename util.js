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
    return this.indexOf(this.find(name));
};

Array.prototype.remove = function(name) {
    this.splice(this.indexOfName(name), 1);
};

Array.prototype.update = function(name, data) {
    this[this.indexOf(this.find(name))] = data;
};