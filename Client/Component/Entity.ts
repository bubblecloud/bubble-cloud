/// <reference path="../../typings/babylonjs/babylonjs.d.ts" />

var entityIdCounter = 0;

/**
 * Entity value object.
 */
class Entity {
    id: string;
    position: BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
    rotationQuaternion: BABYLON.Quaternion = new BABYLON.Quaternion();
    scaling: BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);

    interpolatedPosition: BABYLON.Vector3;
    interpolatedRotationQuaternion: BABYLON.Quaternion;

    removed: boolean = false;

    external: boolean = false;

    dynamic: boolean = false;

    newId() {
        entityIdCounter++;
        this.id = '' + entityIdCounter;
    }
}
