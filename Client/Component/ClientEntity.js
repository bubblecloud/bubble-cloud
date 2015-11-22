/// <reference path="../../typings/babylonjs/babylonjs.d.ts" />
var entityIdCounter = 0;
var ClientEntity = (function () {
    function ClientEntity() {
        this.position = new BABYLON.Vector3(0, 0, 0);
        this.rotationQuaternion = new BABYLON.Quaternion();
        this.scaling = new BABYLON.Vector3(0, 0, 0);
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
