var Entity_1 = require("./Entity");
var InConnection = (function () {
    function InConnection() {
        this.entities = [];
        this.idMap = {};
        this.receive = function (entity) {
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
        };
    }
    return InConnection;
})();
exports.InConnection = InConnection;
