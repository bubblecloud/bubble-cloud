/// <reference path="../Utilities/WsClient.ts" />
/// <reference path="../Utilities/RpcApi.ts" />
var Engine = (function () {
    function Engine() {
        this.api = getProxy('rpc', RpcApi);
    }
    Engine.prototype.start = function () {
        this.ws = new WsClient('ws://127.0.0.1:3000/ws');
        this.ws.setOnReceiveObject(function (message) {
            console.log(JSON.stringify(message));
        });
        var wsClient = this.ws;
        this.ws.setOnOpen(function () {
            wsClient.sendObject({ 'test': 'message' });
        });
        this.api.subtract(44, 23).then(function (result) {
            console.log(result);
        }).catch(function (error) {
            console.log(error);
        });
        this.intervalHandle = setInterval(this.run, 300);
    };
    Engine.prototype.stop = function () {
        clearInterval(this.intervalHandle);
    };
    Engine.prototype.run = function () {
        console.log((new Date).getTime());
    };
    return Engine;
})();
