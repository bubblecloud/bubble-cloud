/// <reference path="../Utilities/WsClient.ts" />
/// <reference path="../Utilities/RpcApi.ts" />
var ClientEngine = (function () {
    function ClientEngine() {
        this.api = getProxy('rpc', RpcApi);
        this.running = false;
        this.model = new ClientModel();
        this.avatarController = new AvatarController(this);
        this.keyboardReader = new KeyboardReader();
        this.mouseReader = new MouseReader(this);
        this.renderer = new Renderer(this, this.model, this.keyboardReader);
        this.startTimeMillis = new Date().getTime();
    }
    ClientEngine.prototype.startup = function () {
        var _this = this;
        this.ws = new WsClient('ws://' + location.host + '/ws');
        this.ws.setOnOpen(function () {
            _this.avatarController.startup();
            _this.running = true;
        });
        this.ws.setOnReceiveObject(function (entity) {
            if (entity.removed) {
                _this.model.remove(entity);
            }
            else {
                _this.model.put(entity);
            }
        });
        this.api.subtract(44, 23).then(function (result) {
            console.log(result);
        }).catch(function (error) {
            console.log(error);
        });
        this.renderer.startup();
        this.lastLoopTimeMillis = (new Date).getTime();
    };
    ClientEngine.prototype.shutdown = function () {
        this.renderer.shutdown();
        this.avatarController.shutdown();
    };
    ClientEngine.prototype.loop = function () {
        var timeMillis = (new Date).getTime();
        var timeDeltaMillis = timeMillis - this.lastLoopTimeMillis;
        if (this.running) {
            this.avatarController.loop(timeMillis, timeDeltaMillis);
        }
        this.lastLoopTimeMillis = timeMillis;
    };
    return ClientEngine;
})();
