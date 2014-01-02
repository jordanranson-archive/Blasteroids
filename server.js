// Third party
var colors = require('colors');

// Constants
require('./lib/constants.js');
require('./lib/key.js');

// Core
require('./lib/util.js');
require('./lib/class.js');
require('./lib/packet.js');
require('./server/server.js');

// Objects
require('./lib/entity.js');
require('./lib/entities/player.js');

var server = new global.Server( global.Constants.SERVER_PORT );
server.run();
