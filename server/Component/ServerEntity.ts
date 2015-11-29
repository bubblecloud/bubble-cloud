/**
 * Vector3 value object.
 */
export class Vector3 {
    x:number = 0;
    y:number = 0;
    z:number = 0;
}

/**
 * Quaternion value object.
 */
export class Quaternion {
    x:number = 0;
    y:number = 0;
    z:number = 0;
    w:number = 1;
}

var entityIdCounter = 1;

/**
 * Entity value object.
 */
export class ServerEntity {
    id: string; // current ID
    oid: string; // original ID
    _id: string; // unique persistent ID

    type: string; // The entity type
    repo: string; // The repository of the entity type

    core: boolean = false;
    removed: boolean = false;
    external: boolean = false;
    dynamic: boolean = false;

    owner: string;

    position: Vector3 = new Vector3();
    rotationQuaternion: Quaternion = new Quaternion();
    scaling: Vector3 = new Vector3();
}

export function newId(entity: ServerEntity) : void {
    entityIdCounter++;
    entity.id = '' + entityIdCounter;
}