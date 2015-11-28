var Vector3 = BABYLON.Vector3;
var Quaternion = BABYLON.Quaternion;
var entityIdCounter = 0;
var ClientEntity = (function () {
    function ClientEntity() {
        this.position = new Vector3(0, 0, 0);
        this.rotationQuaternion = new Quaternion();
        this.scaling = new Vector3(0, 0, 0);
        this.core = false;
        this.removed = false;
        this.external = false;
        this.dynamic = false;
    }
    ClientEntity.prototype.newId = function () {
        entityIdCounter++;
        this.id = '' + entityIdCounter;
    };
    return ClientEntity;
})();
exports.ClientEntity = ClientEntity;
