var Model_1 = require("./Model");
var Entity_1 = require("./Entity");
var OutConnection_1 = require("./OutConnection");
var dao = require('../Storage/EntityDao');
var Engine = (function () {
    function Engine(remoteServers) {
        var _this = this;
        this.inConnections = [];
        this.outConnections = [];
        this.model = new Model_1.Model();
        this.remoteServers = remoteServers;
        dao.getEntity('0').then(function (loadedEntity) {
            if (!loadedEntity) {
                _this.zeroEntity = new Entity_1.Entity();
                _this.zeroEntity.id = '' + 0;
                _this.zeroEntity.dynamic = true;
                dao.insertEntity(_this.zeroEntity);
            }
            else {
                _this.zeroEntity = loadedEntity;
            }
            _this.initialize();
        }).catch(function (error) {
            console.error(error);
        });
    }
    Engine.prototype.initialize = function () {
        var _this = this;
        dao.getEntities().then(function (loadedEntities) {
            console.log("loaded " + loadedEntities.length + " from database.");
            for (var _i = 0; _i < loadedEntities.length; _i++) {
                var loadedEntity = loadedEntities[_i];
                _this.model.put(loadedEntity);
            }
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
                if (!entity.external && !entity.dynamic) {
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
                if (!entity.external && !entity.dynamic) {
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
                if (!entity.external && !entity.dynamic) {
                    dao.removeEntity(entity._id);
                }
            };
        }).catch(function (error) {
            console.error(error);
        });
    };
    Engine.prototype.loop = function () {
        var time = new Date().getTime();
        for (var _i = 0, _a = this.inConnections; _i < _a.length; _i++) {
            var inConnection = _a[_i];
            if (time - inConnection.receivedTime > 5000) {
                inConnection.disconnect();
                this.inConnections.splice(this.inConnections.indexOf(inConnection), 1);
            }
            inConnection.send(this.zeroEntity);
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
            outConnection.send(this.zeroEntity);
        }
        console.log('in:' + this.inConnections.length + " out: " + this.outConnections.length);
    };
    return Engine;
})();
exports.Engine = Engine;
