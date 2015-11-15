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
    w:number = 0;
}

/**
 * Entity value object.
 */
export class Entity {
    _id: string;
    position: Vector3 = new Vector3();
    rotationQuaternion: Quaternion = new Quaternion();
    scaling: Vector3 = new Vector3();
}