var ws;

var config = {
    url: "ws://localhost:3000/",
    playerName: "Saman",
    playerId: null
};

function init() {

    if ("WebSocket" in window) {
        console.log("[INFO] WebSocket is supported by your browser.");

        ws = new WebSocket(config.url);

        ws.onopen = function() {
            ws.send(JSON.stringify({
                player: {
                    name: config.playerName
                }
            }));
        };

        ws.onmessage = function(e) {
            var message = JSON.parse(e.data);
            if (message.type === "ctrl") {
                // Handle action
            } else if (message.type === "info") {
                console.log("[INFO] " + message.content);
            }
        };

        ws.onclose = function() {
            console.log("[INFO] Player disconnection. ID = " + config.playerId);
        };
    } else {
        console.log("[ERROR] WebSocket not supported by your browser.");
    }

}

