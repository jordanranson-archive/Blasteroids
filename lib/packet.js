var Packet = global.Class.extend({
    create: function( data ) {
        var packet = {
            time: Date.now(),
            data: data
        };

        return packet;
    }
});
global.Packet = new Packet();