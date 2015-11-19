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
var entityIdCounter = 0;
var Entity = (function () {
    function Entity() {
        this.removed = false;
        this.position = new Vector3();
        this.rotationQuaternion = new Quaternion();
        this.scaling = new Vector3();
    }
    return Entity;
})();
exports.Entity = Entity;
function newId(entity) {
    entityIdCounter++;
    entity.oid = entity.id;
    entity.id = '' + entityIdCounter;
}
exports.newId = newId;
