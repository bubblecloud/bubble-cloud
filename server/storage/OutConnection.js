var Entity_1 = require("./Entity");
var ServerWsClient_1 = require("./ServerWsClient");
var OutConnection = (function () {
    function OutConnection(url, engine) {
        this.receivedTime = new Date().getTime();
        this.wsClient = null;
        this.idMap = {};
        this.send = function (entity) {
            if (this.wsClient && this.connected) {
                entity.external = true;
                this.wsClient.sendObject(entity);
                delete entity.external;
            }
        };
        this.receive = function (entity) {
            if (entity.external) {
                return;
            }
            this.receivedTime = new Date().getTime();
            if (!this.idMap[entity.id]) {
                Entity_1.newId(entity);
                this.idMap[entity.oid] = entity.id;
            }
            else {
                entity.oid = entity.id;
                entity.id = this.idMap[entity.oid];
            }
            this.engine.model.put(entity);
        };
        this.disconnect = function () {
            for (var oid in this.idMap) {
                var id = this.idMap[oid];
                var entity = this.engine.model.get(id);
                entity.removed = true;
                this.engine.model.remove(entity);
            }
            this.wsClient = null;
            this.connected = false;
            console.log('disconnected:' + this.url);
        };
        this.url = url;
        this.engine = engine;
    }
    OutConnection.prototype.connect = function () {
        var _this = this;
        console.log('connecting:' + this.url);
        this.receivedTime = new Date().getTime();
        this.wsClient = new ServerWsClient_1.ServerWsClient(this.url + 'ws');
        this.wsClient.setOnOpen(function () {
            _this.connected = true;
            console.log('connected:' + _this.url);
        });
        this.wsClient.setOnReceiveObject(function (entity) {
            _this.receive(entity);
        });
    };
    OutConnection.prototype.disconnected = function () {
        return this.wsClient == null;
    };
    return OutConnection;
})();
exports.OutConnection = OutConnection;
