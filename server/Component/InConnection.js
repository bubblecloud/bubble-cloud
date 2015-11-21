var ServerEntity_1 = require("./ServerEntity");
var InConnection = (function () {
    function InConnection(remoteAddress, remotePort, email) {
        this.receivedTime = new Date().getTime();
        this.idMap = {};
        this.receive = function (entity) {
            this.receivedTime = new Date().getTime();
            if (!this.idMap[entity.id]) {
                ServerEntity_1.newId(entity);
                this.idMap[entity.oid] = entity.id;
            }
            else {
                entity.oid = entity.id;
                entity.id = this.idMap[entity.oid];
            }
            this.engine.model.put(entity);
        };
        this.connect = function () {
            for (var key in this.engine.model.entities) {
                var entity = this.engine.model.entities[key];
                this.send(entity);
            }
        };
        this.disconnect = function () {
            for (var oid in this.idMap) {
                var id = this.idMap[oid];
                var entity = this.engine.model.get(id);
                if (entity.dynamic) {
                    entity.removed = true;
                    this.engine.model.remove(entity);
                }
            }
            console.log('disconnected: ' + this.remoteAddress + ':' + this.remotePort + " " + this.email);
        };
        this.remoteAddress = remoteAddress;
        this.remotePort = remotePort;
        this.email = email;
        console.log('connected: ' + this.remoteAddress + ':' + this.remotePort + " " + this.email);
    }
    return InConnection;
})();
exports.InConnection = InConnection;
