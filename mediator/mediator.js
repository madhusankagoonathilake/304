var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    // Left blank since the WebSocket server is implemented
});

server.listen(3000, function() {
});

var wsServer = new WebSocketServer({
    httpServer: server
});

var mediator = {
    players: [],
    run: function() {
        wsServer.on('request', function(request) {
            var connection = request.accept(null, request.origin);

            connection.on('message', function(message) {
                if (message.type === 'utf8') {
                    var data = JSON.parse(message.utf8Data);
                    var playerId = Math.ceil(Math.random() * 100000);
                    var player = new tnfPlayer(playerId, data.player.name, connection);

                    // Logging the server activity
                    console.log("Player connected: " + player.toString());

                    // Add player to the game
                    mediator.players.push(player);

                    // Issue player ID
                    mediator.unicast(player, new tnfMessage("ctrl", {
                        action: "set-player-id",
                        params: player.id
                    }));

                    // Notify the connected players
                    mediator.broadcast(new tnfMessage("info", "Player connected: " + player));
                }
            });

            connection.on('close', function(connection) {

            });
        });
    },
    unicast: function(player, object) {
        player.connection.sendUTF(JSON.stringify(object));
    },
    broadcast: function(object) {
        for (i in this.players) {
            this.players[i].connection.sendUTF(JSON.stringify(object));
        }
    }
}

mediator.run();

// Type defs
function tnfPlayer(id, name, connection) {
    this.id = id;
    this.name = name;
    this.connection = connection;
    this.toString = function() {
        return this.name + " [" + this.id + "]";
    }
}

function tnfMessage(type, content) {
    this.type = type;
    this.content = content;
}