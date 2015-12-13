import Vector3 = BABYLON.Vector3;
import Quaternion = BABYLON.Quaternion;

/**
 * Entity value object.
 */
export interface Entity {
    id: string; // ID
    rid: string; // remote ID
    pid: string; // parent ID
    prid: string; // remote parent ID
    _id: string; // unique persistent ID

    name: string; // The entity name
    type: string; // The entity type
    repo: string; // The repository of the entity type

    core: boolean;
    removed: boolean;
    external: boolean;
    dynamic: boolean;
}
