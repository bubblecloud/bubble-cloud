/// <reference path="../../typings/babylonjs/babylonjs.d.ts" />
var entityIdCounter = 0;
var Entity = (function () {
    function Entity() {
        this.position = new BABYLON.Vector3(0, 0, 0);
        this.rotationQuaternion = new BABYLON.Quaternion();
        this.scaling = new BABYLON.Vector3(0, 0, 0);
        this.removed = false;
        this.external = false;
        this.dynamic = false;
    }
    Entity.prototype.newId = function () {
        entityIdCounter++;
        this.id = '' + entityIdCounter;
    };
    return Entity;
})();
