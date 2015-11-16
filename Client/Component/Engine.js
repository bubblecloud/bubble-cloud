/// <reference path="../Utilities/WsClient.ts" />
/// <reference path="../Utilities/RpcApi.ts" />
function runLoop() {
    console.log((new Date).getTime());
}
var Engine = (function () {
    function Engine() {
        this.api = getProxy('rpc', RpcApi);
        this.renderer = new Renderer();
        this.model = new Model();
        this.avatar = new Entity();
    }
    Engine.prototype.start = function () {
        var _this = this;
        this.avatar.newId();
        this.ws = new WsClient('ws://127.0.0.1:3000/ws');
        this.ws.setOnReceiveObject(function (message) {
            _this.model.put(message);
        });
        var wsClient = this.ws;
        this.ws.setOnOpen(function () {
            _this.ws.sendObject(_this.avatar);
        });
        this.api.subtract(44, 23).then(function (result) {
            console.log(result);
        }).catch(function (error) {
            console.log(error);
        });
        this.renderer.start();
        this.lastLoopTimeMillis = (new Date).getTime();
    };
    Engine.prototype.stop = function () {
    };
    Engine.prototype.loop = function () {
        var timeMillis = (new Date).getTime();
        var timeDeltaMillis = timeMillis - this.lastLoopTimeMillis;
        this.lastLoopTimeMillis = timeMillis;
        this.avatar.position.x = 100 * Math.sin(2 * Math.PI * (timeMillis / 10000));
        this.ws.sendObject({ 'id': this.avatar.id, 'position': this.avatar.position });
    };
    return Engine;
})();
