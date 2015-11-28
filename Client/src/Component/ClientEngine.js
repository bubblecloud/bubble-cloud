var ClientModel_1 = require("./ClientModel");
var AvatarController_1 = require("./AvatarController");
var KeyboardReader_1 = require("./KeyboardReader");
var MouseReader_1 = require("./MouseReader");
var Renderer_1 = require("./Renderer");
var RpcApi_1 = require("../Utilities/RpcApi");
var RpcApi_2 = require("../Utilities/RpcApi");
var WsClient_1 = require("../Utilities/WsClient");
var ClientEngine = (function () {
    function ClientEngine() {
        this.api = RpcApi_2.getProxy('rpc', RpcApi_1.RpcApi);
        this.running = false;
        this.model = new ClientModel_1.ClientModel();
        this.avatarController = new AvatarController_1.AvatarController(this);
        this.keyboardReader = new KeyboardReader_1.KeyboardReader();
        this.mouseReader = new MouseReader_1.MouseReader(this);
        this.renderer = new Renderer_1.Renderer(this, this.model, this.keyboardReader);
        this.startTimeMillis = new Date().getTime();
    }
    ClientEngine.prototype.startup = function () {
        var _this = this;
        this.ws = new WsClient_1.WsClient('ws://' + location.host + '/ws');
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
exports.ClientEngine = ClientEngine;
