var ServerModel_1 = require("./ServerModel");
var ServerEntity_1 = require("./ServerEntity");
var ServerEntity_2 = require("./ServerEntity");
var OutConnection_1 = require("./OutConnection");
var dao = require('./EntityDao');
var ServerEngine = (function () {
    function ServerEngine(remoteServers) {
        var _this = this;
        this.inConnections = [];
        this.outConnections = [];
        this.model = new ServerModel_1.ServerModel();
        this.remoteServers = remoteServers;
        dao.getEntity('0').then(function (loadedEntity) {
            if (!loadedEntity) {
                _this.coreEntity = new ServerEntity_1.ServerEntity();
                _this.coreEntity.core = true;
                _this.coreEntity.id = '' + 0;
                _this.coreEntity.dynamic = false;
                _this.coreEntity.repo = 'default';
                _this.coreEntity.type = 'water-world-core';
                dao.insertEntity(_this.coreEntity);
                var skyEntity = new ServerEntity_1.ServerEntity();
                skyEntity.id = '' + 1;
                skyEntity.dynamic = false;
                skyEntity.repo = 'default';
                skyEntity.type = 'water-world-sky';
                dao.insertEntity(skyEntity);
            }
            else {
                _this.coreEntity = loadedEntity;
            }
            _this.initialize();
        }).catch(function (error) {
            console.error(error);
        });
    }
    ServerEngine.prototype.initialize = function () {
        var _this = this;
        dao.getEntities().then(function (loadedEntities) {
            console.log("loaded " + loadedEntities.length + " from database.");
            for (var _i = 0; _i < loadedEntities.length; _i++) {
                var loadedEntity = loadedEntities[_i];
                ServerEntity_2.loadedId(loadedEntity.id);
                _this.model.put(loadedEntity);
            }
            _this.coreEntity = _this.model.entities['0'];
            for (var _a = 0, _b = _this.remoteServers; _a < _b.length; _a++) {
                var remoteServer = _b[_a];
                _this.outConnections.push(new OutConnection_1.OutConnection(remoteServer['url'], remoteServer['x'], remoteServer['y'], remoteServer['z'], _this));
            }
            _this.model.onAdd = function (entity) {
                for (var _i = 0, _a = _this.inConnections; _i < _a.length; _i++) {
                    var inConnection = _a[_i];
                    inConnection.send(entity);
                }
                ;
                for (var _b = 0, _c = _this.outConnections; _b < _c.length; _b++) {
                    var outConnection = _c[_b];
                    if (!entity.external) {
                        outConnection.send(entity);
                    }
                }
                ;
                if (!entity.external && entity.dynamic === false) {
                    dao.insertEntity(entity);
                }
            };
            _this.model.onUpdate = function (entity) {
                for (var _i = 0, _a = _this.inConnections; _i < _a.length; _i++) {
                    var inConnection = _a[_i];
                    inConnection.send(entity);
                }
                ;
                for (var _b = 0, _c = _this.outConnections; _b < _c.length; _b++) {
                    var outConnection = _c[_b];
                    if (!entity.external) {
                        outConnection.send(entity);
                    }
                }
                ;
                if (!entity.external && entity.dynamic === false) {
                    dao.updateEntity(entity);
                }
            };
            _this.model.onRemove = function (entity) {
                for (var _i = 0, _a = _this.inConnections; _i < _a.length; _i++) {
                    var inConnection = _a[_i];
                    inConnection.send(entity);
                }
                ;
                for (var _b = 0, _c = _this.outConnections; _b < _c.length; _b++) {
                    var outConnection = _c[_b];
                    if (!entity.external) {
                        outConnection.send(entity);
                    }
                }
                ;
                if (!entity.external && entity.dynamic === false) {
                    dao.removeEntity(entity.id);
                }
            };
        }).catch(function (error) {
            console.error(error);
        });
    };
    ServerEngine.prototype.loop = function () {
        var time = new Date().getTime();
        for (var _i = 0, _a = this.inConnections; _i < _a.length; _i++) {
            var inConnection = _a[_i];
            if (time - inConnection.receivedTime > 5000) {
                inConnection.disconnect();
                this.inConnections.splice(this.inConnections.indexOf(inConnection), 1);
            }
            inConnection.send(this.coreEntity);
        }
        for (var _b = 0, _c = this.outConnections; _b < _c.length; _b++) {
            var outConnection = _c[_b];
            if (outConnection.disconnected()) {
                outConnection.connect();
            }
            else {
                if (time - outConnection.receivedTime > 5000) {
                    outConnection.disconnect();
                }
            }
            outConnection.send(this.coreEntity);
        }
    };
    ServerEngine.prototype.hasRole = function (role, userId) {
        var core = this.model.entities[0];
        if (!userId) {
            return false;
        }
        if (!core || !core.core) {
            console.log('Error. Role check failed due to core not available. Role: ' + role + ' User ID: ' + userId);
            return false;
        }
        if (role == 'admin') {
            if (!core.roleMembers['admin']) {
                console.log('Server not secure as no admins defined. User ID granted temporary admin role: ' + userId);
                return true;
            }
            for (var _i = 0, _a = core.roleMembers['admin']; _i < _a.length; _i++) {
                var candidateUserId = _a[_i];
                if (candidateUserId == userId) {
                    return true;
                }
            }
            return false;
        }
        if (role == 'member') {
            if (!core.roleMembers['member']) {
                return false;
            }
            for (var _b = 0, _c = core.roleMembers['member']; _b < _c.length; _b++) {
                var candidateUserId = _c[_b];
                if (candidateUserId == userId) {
                    return true;
                }
            }
            return false;
        }
        return false;
    };
    return ServerEngine;
})();
exports.ServerEngine = ServerEngine;
