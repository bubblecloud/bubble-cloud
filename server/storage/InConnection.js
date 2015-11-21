var Entity_1 = require("./Entity");
var InConnection = (function () {
    function InConnection() {
        this.receivedTime = new Date().getTime();
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
            for (var oid in this.idMap) {
                var id = this.idMap[oid];
                var entity = this.engine.model.get(id);
                entity.removed = true;
                this.engine.model.remove(entity);
            }
        };
    }
    return InConnection;
})();
exports.InConnection = InConnection;
