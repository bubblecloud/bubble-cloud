var ClientModel_1 = require("./ClientModel");
var AvatarController_1 = require("./AvatarController");
var KeyboardReader_1 = require("./KeyboardReader");
var MouseReader_1 = require("./MouseReader");
var Renderer_1 = require("./Renderer");
var RpcApi_1 = require("../Utilities/RpcApi");
var RpcApi_2 = require("../Utilities/RpcApi");
var WsClient_1 = require("../Utilities/WsClient");
var ConsoleController_1 = require("./ConsoleController");
var ClientState_1 = require("./ClientState");
var ActuatorRegister_1 = require("./ActuatorRegister");
var ClientEntity_1 = require("./ClientEntity");
var WaterWorldModule_1 = require("../environments/water-world/WaterWorldModule");
var CommonModule_1 = require("../environments/common/CommonModule");
var ClientGrid_1 = require("./ClientGrid");
var MaterialRegister_1 = require("./MaterialRegister");
var ClientEngine = (function () {
    function ClientEngine() {
        this.api = RpcApi_2.getProxy('rpc', RpcApi_1.RpcApi);
        this.running = false;
        this.state = new ClientState_1.ClientState();
        this.grid = new ClientGrid_1.ClientGrid();
        this.model = new ClientModel_1.ClientModel();
        this.core = new ClientEntity_1.CoreEntity();
        this.avatarController = new AvatarController_1.AvatarController(this);
        this.keyboardReader = new KeyboardReader_1.KeyboardReader(this);
        this.mouseReader = new MouseReader_1.MouseReader(this);
        this.actuatorRegister = new ActuatorRegister_1.ActuatorRegister();
        this.materialRegister = new MaterialRegister_1.MaterialRegister();
        this.renderer = new Renderer_1.Renderer(this, this.model, this.keyboardReader);
        this.consoleController = new ConsoleController_1.ConsoleController(this);
        this.startTimeMillis = new Date().getTime();
    }
    ClientEngine.prototype.startup = function () {
        var _this = this;
        this.consoleController.println('Client starting up...');
        this.ws = new WsClient_1.WsClient('ws://' + location.host + '/ws');
        this.ws.setOnOpen(function () {
            _this.avatarController.startup();
            _this.running = true;
            _this.consoleController.println('Server connected.');
        });
        this.ws.setOnReceiveObject(function (entity) {
            var id = entity.id;
            entity.id = entity.oid;
            entity.oid = id;
            var pid = entity.pid;
            entity.pid = entity.poid;
            entity.poid = pid;
            entity.id = _this.model.idRegister.processReceivedIdPair(entity.id, entity.oid, _this.model.localIdRemoteIdMap, _this.model.remoteIdLocalIdMap);
            if (entity.poid) {
                entity.pid = _this.model.idRegister.processReceivedIdPair(entity.pid, entity.poid, _this.model.localIdRemoteIdMap, _this.model.remoteIdLocalIdMap);
            }
            else {
                entity.pid = null;
                entity.poid = null;
            }
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
        new CommonModule_1.CommonModule().load(this);
        new WaterWorldModule_1.WaterWorldModule().load(this);
        this.lastLoopTimeMillis = (new Date).getTime();
        this.consoleController.println('Client started.');
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
    ClientEngine.prototype.getCore = function () {
        if (!this.core) {
            this.core = this.model.copy('0', new ClientEntity_1.CoreEntity());
            this.core.oid = '0';
            this.core.id = '' + this.model.idRegister.getNewId();
        }
        else {
            var id = this.core.id;
            this.model.copy('0', this.core);
            this.core.oid = '0';
            this.core.id = id;
        }
        return this.core;
    };
    return ClientEngine;
})();
exports.ClientEngine = ClientEngine;
