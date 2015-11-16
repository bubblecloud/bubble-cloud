/// <reference path="../../typings/babylonjs/babylonjs.d.ts" />

var entityIdCounter = 0;

/**
 * Entity value object.
 */
class Entity {
    id: string;
    position: BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
    rotation: BABYLON.Quaternion = new BABYLON.Quaternion();
    scaling: BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);

    newId() {
        entityIdCounter++;
        this.id = '' + entityIdCounter;
    }
}
