var Vector3 = (function () {
    function Vector3() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    return Vector3;
})();
exports.Vector3 = Vector3;
var Quaternion = (function () {
    function Quaternion() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
    }
    return Quaternion;
})();
exports.Quaternion = Quaternion;
var entityIdCounter = 1;
function reserveId(id) {
    entityIdCounter = Math.max(entityIdCounter, Number(id));
}
exports.reserveId = reserveId;
var ServerEntity = (function () {
    function ServerEntity() {
        this.core = false;
        this.removed = false;
        this.external = false;
        this.dynamic = false;
        this.position = new Vector3();
        this.rotationQuaternion = new Quaternion();
        this.scaling = new Vector3();
        this.roleMembers = {};
        this.scaling.x = 1;
        this.scaling.y = 1;
        this.scaling.z = 1;
    }
    return ServerEntity;
})();
exports.ServerEntity = ServerEntity;
function newId(entity) {
    entityIdCounter++;
    entity.id = '' + entityIdCounter;
}
exports.newId = newId;
