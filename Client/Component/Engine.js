/// <reference path="../Utilities/WsClient.ts" />
/// <reference path="../Utilities/RpcApi.ts" />
function runLoop() {
    console.log((new Date).getTime());
}
var Engine = (function () {
    function Engine() {
        this.api = getProxy('rpc', RpcApi);
        this.model = new Model();
        this.renderer = new Renderer(this.model);
        this.startTimeMillis = new Date().getTime();
        this.avatar = new Entity();
    }
    Engine.prototype.start = function () {
        var _this = this;
        var timeMillis = (new Date).getTime();
        this.avatar.newId();
        this.avatar.position.x = 3 * Math.cos(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000));
        this.avatar.position.z = 3 * Math.sin(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000));
        this.avatar.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000), 0, 0);
        this.ws = new WsClient('ws://127.0.0.1:3000/ws');
        this.ws.setOnReceiveObject(function (entity) {
            if (entity.removed) {
                _this.model.remove(entity);
            }
            else {
                _this.model.put(entity);
            }
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
        this.avatar.position.x = 3 * Math.cos(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000));
        this.avatar.position.z = 3 * Math.sin(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000));
        this.avatar.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000), 0, 0);
        this.ws.sendObject({ 'id': this.avatar.id, 'position': this.avatar.position, 'rotationQuaternion': this.avatar.rotationQuaternion });
        var timeDeltaMillis = timeMillis - this.lastLoopTimeMillis;
        this.lastLoopTimeMillis = timeMillis;
    };
    return Engine;
})();
