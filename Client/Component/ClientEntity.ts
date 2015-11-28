import Vector3 = BABYLON.Vector3;
import Quaternion = BABYLON.Quaternion;
var entityIdCounter = 0;

/**
 * Entity value object.
 */
export class ClientEntity {
    id: string;
    oid: string; // original ID
    _id: string; // unique persistent ID

    position: Vector3 = new Vector3(0,0,0);
    rotationQuaternion: Quaternion = new Quaternion();
    scaling: Vector3 = new Vector3(0,0,0);

    interpolatedPosition: Vector3;
    interpolatorPosition: Vector3;
    interpolatorRotationQuaternion: Quaternion;
    interpolatedRotationQuaternion: Quaternion;

    core: boolean = false;
    removed: boolean = false;
    external: boolean = false;
    dynamic: boolean = false;

    newId() {
        entityIdCounter++;
        this.id = '' + entityIdCounter;
    }
}
