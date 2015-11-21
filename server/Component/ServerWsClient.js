var WebSocket = require('websocket').w3cwebsocket;
var ServerWsClient = (function () {
    function ServerWsClient(url) {
        this.wsSocket = new WebSocket(url, "json");
    }
    ServerWsClient.prototype.setOnOpen = function (onOpen) {
        this.wsSocket.onopen = onOpen;
    };
    ServerWsClient.prototype.sendObject = function (message) {
        this.wsSocket.send(JSON.stringify(message));
    };
    ServerWsClient.prototype.setOnReceiveObject = function (onMessage) {
        this.wsSocket.onmessage = function (event) {
            onMessage(JSON.parse(event.data));
        };
    };
    return ServerWsClient;
})();
exports.ServerWsClient = ServerWsClient;
