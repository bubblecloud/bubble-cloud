/// <reference path="../../typings/babylonjs/babylonjs.d.ts" />

var entityIdCounter = 0;

/**
 * Entity value object.
 */
class ClientEntity {
    id: string;
    oid: string; // original ID
    _id: string; // unique persistent ID

    position: BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
    rotationQuaternion: BABYLON.Quaternion = new BABYLON.Quaternion();
    scaling: BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);

    interpolatedPosition: BABYLON.Vector3;
    interpolatorPosition: BABYLON.Vector3;
    interpolatorRotationQuaternion: BABYLON.Quaternion;
    interpolatedRotationQuaternion: BABYLON.Quaternion;

    core: boolean = false;
    removed: boolean = false;
    external: boolean = false;
    dynamic: boolean = false;

    newId() {
        entityIdCounter++;
        this.id = '' + entityIdCounter;
    }
}
