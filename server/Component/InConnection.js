var InConnection = (function () {
    function InConnection(remoteAddress, remotePort, email, userId) {
        this.receivedTime = new Date().getTime();
        this.remoteIdLocalIdMap = {};
        this.localIdRemoteIdMap = {};
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
    InConnection.prototype.send = function (entity) {
        try {
            if (this.remoteIsServer && entity.external) {
                return;
            }
            entity.rid = this.localIdRemoteIdMap[entity.id];
            delete entity.rid;
            delete entity.prid;
            entity.rid = this.localIdRemoteIdMap[entity.id];
            if (entity.pid) {
                entity.prid = this.localIdRemoteIdMap[entity.pid];
            }
            this.sendObject(entity);
            delete entity.rid;
            delete entity.prid;
        }
        catch (error) {
        }
    };
    InConnection.prototype.receive = function (entity) {
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
        var rid = entity.id;
        if (!this.remoteIdLocalIdMap[rid]) {
            if (!this.remoteIsServer && entity.rid) {
                if (entity.dynamic === true) {
                    console.log('Access denied: Client attempted to write to dynamic entity it did not add in this session.');
                    return;
                }
                if (!this.engine.model.entities[entity.rid]) {
                    console.log('Access denied: Client attempted to update non existent persistent entity it did not add in this session: ' + entity.rid);
                    return;
                }
                console.log('Client updating persistent entity: ' + entity.rid);
                entity.id = entity.rid;
                this.remoteIdLocalIdMap[rid] = entity.id;
                this.localIdRemoteIdMap[entity.id] = rid;
            }
            else {
                entity.id = '' + this.engine.model.idRegister.getNewId();
                this.remoteIdLocalIdMap[rid] = entity.id;
                this.localIdRemoteIdMap[entity.id] = rid;
            }
        }
        else {
            entity.id = this.remoteIdLocalIdMap[rid];
        }
        var prid = entity.pid;
        if (prid) {
            if (!this.remoteIdLocalIdMap[prid]) {
                if (!this.remoteIsServer && entity.prid) {
                    entity.pid = entity.prid;
                    this.remoteIdLocalIdMap[prid] = entity.pid;
                    this.localIdRemoteIdMap[entity.pid] = prid;
                }
                else {
                    var pid = '' + this.engine.model.idRegister.getNewId();
                    entity.pid = pid;
                    this.remoteIdLocalIdMap[prid] = entity.pid;
                    this.localIdRemoteIdMap[entity.pid] = prid;
                }
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
    return InConnection;
})();
exports.InConnection = InConnection;
