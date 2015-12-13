var ServerEntity_1 = require("./ServerEntity");
var ServerEntity_2 = require("./ServerEntity");
var InConnection = (function () {
    function InConnection(remoteAddress, remotePort, email, userId) {
        this.receivedTime = new Date().getTime();
        this.remoteIdLocalIdMap = {};
        this.localIdRemoteIdMap = {};
        this.receive = function (entity) {
            this.receivedTime = new Date().getTime();
            if (entity._id) {
                delete entity._id;
            }
            if (entity.id == '' + 0 && entity.core && entity.external) {
                this.remoteIsServer = true;
            }
            if (!entity.external) {
                entity.owner = this.email;
            }
            var oid = entity.id;
            if (!this.remoteIdLocalIdMap[oid]) {
                if (!this.remoteIsServer && entity.oid) {
                    if (entity.dynamic === true) {
                        console.log('Access denied: Client attempted to write to dynamic entity it did not add in this session.');
                        return;
                    }
                    if (!this.engine.model.entities[entity.oid]) {
                        console.log('Access denied: Client attempted to update non existent persistent entity it did not add in this session: ' + entity.oid);
                        return;
                    }
                    console.log('Client updating persistent entity: ' + entity.oid);
                    entity.id = entity.oid;
                    this.remoteIdLocalIdMap[oid] = entity.id;
                    this.localIdRemoteIdMap[entity.id] = oid;
                }
                else {
                    ServerEntity_1.newId(entity);
                    while (this.remoteIdLocalIdMap[entity.id]) {
                        ServerEntity_1.newId(entity);
                    }
                    this.remoteIdLocalIdMap[oid] = entity.id;
                    this.localIdRemoteIdMap[entity.id] = oid;
                }
            }
            else {
                entity.id = this.remoteIdLocalIdMap[oid];
            }
            var poid = entity.pid;
            if (poid) {
                if (!this.remoteIdLocalIdMap[poid]) {
                    if (!this.remoteIsServer && entity.poid) {
                        entity.pid = entity.poid;
                        this.remoteIdLocalIdMap[poid] = entity.pid;
                        this.localIdRemoteIdMap[entity.pid] = poid;
                    }
                    else {
                        var pid = '' + ServerEntity_2.getNewId();
                        while (this.remoteIdLocalIdMap[pid]) {
                            pid = '' + ServerEntity_2.getNewId();
                        }
                        entity.pid = pid;
                        this.remoteIdLocalIdMap[poid] = entity.pid;
                        this.localIdRemoteIdMap[entity.pid] = poid;
                    }
                }
                else {
                    entity.pid = this.remoteIdLocalIdMap[poid];
                }
                delete entity.poid;
            }
            else {
                entity.pid = null;
                entity.poid = null;
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
        this.connect = function () {
            for (var key in this.engine.model.entities) {
                var entity = this.engine.model.entities[key];
                if (this.remoteIsServer && entity.external) {
                    continue;
                }
                this.send(entity);
            }
        };
        this.disconnect = function () {
            for (var oid in this.remoteIdLocalIdMap) {
                var id = this.remoteIdLocalIdMap[oid];
                var entity = this.engine.model.get(id);
                if (entity && (entity.dynamic || entity.external)) {
                    entity.removed = true;
                    this.engine.model.remove(entity);
                }
            }
            console.log('disconnected: ' + this.remoteAddress + ':' + this.remotePort + " " + this.email);
        };
        this.remoteAddress = remoteAddress;
        this.remotePort = remotePort;
        this.email = email;
        this.userId = userId;
        console.log('connected: ' + this.remoteAddress + ':' + this.remotePort + " " + this.email);
    }
    return InConnection;
})();
exports.InConnection = InConnection;
