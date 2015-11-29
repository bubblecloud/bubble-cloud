var ServerEntity_1 = require("./ServerEntity");
var InConnection = (function () {
    function InConnection(remoteAddress, remotePort, email, userId) {
        this.receivedTime = new Date().getTime();
        this.oidIdMap = {};
        this.idOIdMap = {};
        this.receive = function (entity) {
            this.receivedTime = new Date().getTime();
            if (entity._id) {
                delete entity._id;
            }
            if (entity.id == '' + 0 && entity.core) {
                this.remoteIsServer = true;
            }
            if (!entity.external) {
                entity.owner = this.email;
            }
            var oid = entity.id;
            if (!this.oidIdMap[oid]) {
                if (!this.remoteIsServer && entity.oid) {
                    if (entity.dynamic === true) {
                        console.log('Access denied: Client attempted to write to dynamic entity it did not add in this session.');
                        return;
                    }
                    if (!this.engine.model[entity.oid]) {
                        console.log('Access denied: Client attempted to update non existent persistent entity it did not add in this session.');
                        return;
                    }
                    console.log('Client updating persistent entity: ' + entity.oid);
                    entity.id = entity.oid;
                    this.oidIdMap[oid] = entity.id;
                    this.idOIdMap[entity.id] = oid;
                }
                else {
                    ServerEntity_1.newId(entity);
                    while (this.oidIdMap[entity.id]) {
                        ServerEntity_1.newId(entity);
                    }
                    this.oidIdMap[oid] = entity.id;
                    this.idOIdMap[entity.id] = oid;
                }
            }
            else {
                entity.id = this.oidIdMap[oid];
            }
            if (entity.id === '0' || entity.core) {
                if (!this.engine.hasRole('admin', this.userId)) {
                    console.log('Access denied: Client attempted to write to core without admin role. User ID: ' + this.userId);
                    return;
                }
            }
            if (entity.dynamic === false) {
                if (!this.engine.hasRole('admin', this.userId) && !this.engine.hasRole('admin', this.userId)) {
                    console.log('Access denied: Client attempted to write persistent entity without admin or member role. ' + this.userId);
                    return;
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
            for (var oid in this.oidIdMap) {
                var id = this.oidIdMap[oid];
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
