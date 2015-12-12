var ServerEntity_1 = require("./ServerEntity");
var ServerEntity_2 = require("./ServerEntity");
var ServerWsClient_1 = require("./ServerWsClient");
var OutConnection = (function () {
    function OutConnection(url, x, y, z, engine) {
        this.receivedTime = new Date().getTime();
        this.running = false;
        this.wsClient = null;
        this.oidIdMap = {};
        this.send = function (entity) {
            if (this.wsClient && this.running) {
                entity.external = true;
                entity.position.x += this.x;
                entity.position.y += this.y;
                entity.position.z += this.z;
                this.wsClient.sendObject(entity);
                entity.position.x -= this.x;
                entity.position.y -= this.y;
                entity.position.z -= this.z;
                delete entity.external;
            }
        };
        this.receive = function (entity) {
            if (entity.external) {
                return;
            }
            if (entity._id) {
                delete entity._id;
            }
            this.receivedTime = new Date().getTime();
            var oid = entity.id;
            if (!this.oidIdMap[oid]) {
                ServerEntity_1.newId(entity);
                while (this.oidIdMap[oid]) {
                    ServerEntity_1.newId(entity);
                }
                this.oidIdMap[oid] = entity.id;
            }
            else {
                entity.id = this.oidIdMap[oid];
            }
            var poid = entity.pid;
            if (poid) {
                if (!this.oidIdMap[poid]) {
                    var pid = '' + ServerEntity_2.getNewId();
                    while (this.oidIdMap[poid]) {
                        pid = '' + ServerEntity_2.getNewId();
                    }
                    this.pid = pid;
                    this.oidIdMap[poid] = entity.pid;
                }
                else {
                    entity.pid = this.oidIdMap[poid];
                }
                delete entity.poid;
            }
            else {
                entity.pid = null;
                entity.poid = null;
            }
            entity.external = true;
            entity.position.x -= this.x;
            entity.position.y -= this.y;
            entity.position.z -= this.z;
            if (entity.id === '0') {
                return;
            }
            if (entity.id === '0') {
                if (!this.engine.hasRole('admin', this.userId)) {
                    console.log('Access denied: Client attempted to write to core without admin role. User ID: ' + this.userId);
                    return;
                }
            }
            if (entity.external === false && entity.dynamic === false) {
                if (!this.engine.hasRole('admin', this.userId) && !this.engine.hasRole('member', this.userId)) {
                    console.log('Access denied: Client attempted to persist entity without admin or member role. ' + this.userId);
                    return;
                }
            }
            if (this.engine.model.entities[entity.id]) {
                var existingEntity = this.engine.model.entities[entity.id];
                if (existingEntity.external = false && existingEntity.dynamic === false) {
                    if (!this.engine.hasRole('admin', this.userId) && !this.engine.hasRole('member', this.userId)) {
                        console.log('Access denied: Client attempted to update existing persistent entity without admin or member role. ' + this.userId);
                        return;
                    }
                }
            }
            this.engine.model.put(entity);
        };
        this.disconnect = function () {
            for (var oid in this.oidIdMap) {
                var id = this.oidIdMap[oid];
                var entity = this.engine.model.get(id);
                if (entity) {
                    entity.removed = true;
                    this.engine.model.remove(entity);
                }
            }
            this.wsClient = null;
            this.running = false;
            console.log('disconnected:' + this.url);
        };
        this.url = url;
        this.x = x;
        this.y = y;
        this.z = z;
        this.engine = engine;
    }
    OutConnection.prototype.connect = function () {
        var _this = this;
        console.log('connecting:' + this.url);
        this.receivedTime = new Date().getTime();
        this.wsClient = new ServerWsClient_1.ServerWsClient(this.url + 'ws');
        this.wsClient.setOnOpen(function () {
            _this.running = true;
            console.log('connected:' + _this.url);
            for (var key in _this.engine.model.entities) {
                var entity = _this.engine.model.entities[key];
                console.log('sending entity to remote server: ' + entity.id);
                if (!entity.external) {
                    _this.send(entity);
                }
            }
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
