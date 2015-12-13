var ServerWsClient_1 = require("./ServerWsClient");
var OutConnection = (function () {
    function OutConnection(url, x, y, z, engine) {
        this.receivedTime = new Date().getTime();
        this.running = false;
        this.wsClient = null;
        this.remoteIdLocalIdMap = {};
        this.disconnect = function () {
            for (var oid in this.remoteIdLocalIdMap) {
                var id = this.remoteIdLocalIdMap[oid];
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
    OutConnection.prototype.send = function (entity) {
        if (this.wsClient && this.running) {
            delete entity.rid;
            delete entity.prid;
            entity.external = true;
            if (!entity.pid) {
                entity.position.x += this.x;
                entity.position.y += this.y;
                entity.position.z += this.z;
            }
            this.wsClient.sendObject(entity);
            if (!entity.pid) {
                entity.position.x -= this.x;
                entity.position.y -= this.y;
                entity.position.z -= this.z;
            }
            delete entity.external;
        }
    };
    OutConnection.prototype.receive = function (entity) {
        if (entity.external) {
            return;
        }
        if (entity._id) {
            delete entity._id;
        }
        this.receivedTime = new Date().getTime();
        var rid = entity.id;
        if (!this.remoteIdLocalIdMap[rid]) {
            entity.id = '' + this.engine.model.idRegister.getNewId();
            this.remoteIdLocalIdMap[rid] = entity.id;
        }
        else {
            entity.id = this.remoteIdLocalIdMap[rid];
        }
        var prid = entity.pid;
        if (prid) {
            if (!this.remoteIdLocalIdMap[prid]) {
                var pid = '' + this.engine.model.idRegister.getNewId();
                entity.pid = pid;
                this.remoteIdLocalIdMap[prid] = entity.pid;
            }
            else {
                entity.pid = this.remoteIdLocalIdMap[prid];
            }
            delete entity.prid;
        }
        else {
            entity.pid = null;
            entity.prid = null;
        }
        entity.external = true;
        if (!entity.pid) {
            entity.position.x -= this.x;
            entity.position.y -= this.y;
            entity.position.z -= this.z;
        }
        if (entity.id === '0') {
            return;
        }
        if (entity.id === '0') {
            console.log('Access denied: Remote server tried to write to core:' + entity.id);
            return;
        }
        if (entity.external === false && entity.dynamic === false) {
            console.log('Access denied: Remote server tried to write to persistent entity:' + entity.id);
            return;
        }
        if (this.engine.model.entities[entity.id]) {
            var existingEntity = this.engine.model.entities[entity.id];
            if (existingEntity.external = false && existingEntity.dynamic === false) {
                console.log('Access denied: Remote server tried to write to persistent entity:' + entity.id);
            }
        }
        this.engine.model.put(entity);
    };
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
