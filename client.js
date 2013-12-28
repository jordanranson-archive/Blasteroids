var socket, game;

$(function() {

    socket = io.connect('http://localhost:3000');
    game = new Game();
    game.run();

});