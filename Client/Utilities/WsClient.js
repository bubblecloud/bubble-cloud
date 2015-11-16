var WsClient = (function () {
    function WsClient(url) {
        this.wsSocket = new WebSocket(url, "json");
    }
    WsClient.prototype.setOnOpen = function (onOpen) {
        this.wsSocket.onopen = onOpen;
    };
    WsClient.prototype.sendObject = function (message) {
        this.wsSocket.send(JSON.stringify(message));
    };
    WsClient.prototype.setOnReceiveObject = function (onMessage) {
        this.wsSocket.onmessage = function (event) {
            onMessage(JSON.parse(event.data));
        };
    };
    return WsClient;
})();
