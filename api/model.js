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
        this.w = 0;
    }
    return Quaternion;
})();
exports.Quaternion = Quaternion;
var Entity = (function () {
    function Entity() {
        this.position = new Vector3();
        this.rotationQuaternion = new Quaternion();
        this.scaling = new Vector3();
    }
    return Entity;
})();
exports.Entity = Entity;
