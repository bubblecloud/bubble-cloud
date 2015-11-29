var WsClient = (function () {
    function WsClient(url) {
        this.wsSocket = new WebSocket(url, "json");
    }
    WsClient.prototype.setOnOpen = function (onOpen) {
        this.wsSocket.onopen = onOpen;
    };
    WsClient.prototype.sendObject = function (message) {
        try {
            this.wsSocket.send(JSON.stringify(message));
        }
        catch (error) {
            console.error('WS: Error sending object: ' + error.message);
        }
    };
    WsClient.prototype.setOnReceiveObject = function (onMessage) {
        this.wsSocket.onmessage = function (event) {
            onMessage(JSON.parse(event.data));
        };
    };
    return WsClient;
})();
exports.WsClient = WsClient;
