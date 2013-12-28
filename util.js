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

String.prototype.brightness = function(percent) {   
    var num = parseInt(this.slice(1),16), 
        amt = Math.round(2.55 * percent), 
        R = (num >> 16) + amt, 
        G = (num >> 8 & 0x00FF) + amt, 
        B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
};

CanvasRenderingContext2D.prototype.regularPolygon = function(x, y, radius, sides) {
    if (sides < 3) return;

    this.beginPath();
    var a = ((Math.PI * 2)/sides);
    this.translate(x, y);
    this.moveTo(radius,0);
    for (var i = 1; i < sides; i++) {
        this.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
    }
    this.closePath();
};