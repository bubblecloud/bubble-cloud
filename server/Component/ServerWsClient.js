var WebSocket = require('websocket').w3cwebsocket;
var ServerWsClient = (function () {
    function ServerWsClient(url) {
        this.wsSocket = new WebSocket(url, "json");
    }
    ServerWsClient.prototype.setOnOpen = function (onOpen) {
        this.wsSocket.onopen = onOpen;
    };
    ServerWsClient.prototype.sendObject = function (message) {
        try {
            this.wsSocket.send(JSON.stringify(message));
        }
        catch (error) {
            console.error('WS: Error sending object: ' + error.message);
        }
    };
    ServerWsClient.prototype.setOnReceiveObject = function (onMessage) {
        this.wsSocket.onmessage = function (event) {
            try {
                onMessage(JSON.parse(event.data));
            }
            catch (error) {
                console.error(error.message);
            }
        };
    };
    return ServerWsClient;
})();
exports.ServerWsClient = ServerWsClient;
