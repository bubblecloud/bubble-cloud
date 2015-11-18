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

/**
 * Entity value object.
 */
export class Entity {
    id: number; // current ID
    oid: number; // original ID
    _id: string; // unique persistent ID
    position: Vector3 = new Vector3();
    rotationQuaternion: Quaternion = new Quaternion();
    scaling: Vector3 = new Vector3();
}