import Vector3 = BABYLON.Vector3;
import Quaternion = BABYLON.Quaternion;
var entityIdCounter = 1;

export function reserveId(oid: string) {
    entityIdCounter = Math.max(entityIdCounter, Number(oid));
}

export function getNewId() : number {
    entityIdCounter++;
    return entityIdCounter;
}

/**
 * Entity value object.
 */
export class ClientEntity {
    id: string; // ID
    oid: string; // original ID
    pid: string; // parent ID
    poid: string; // original parent ID
    _id: string; // unique persistent ID

    name: string; // The entity name
    type: string; // The entity type
    repo: string; // The repository of the entity type

    position: Vector3 = new Vector3(0,0,0);
    rotationQuaternion: Quaternion = new Quaternion();
    scaling: Vector3 = new Vector3(1,1,1);

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

export class PrimitiveEntity extends ClientEntity {
    pType: string;
}

export class SurfaceEntity extends ClientEntity {
    ni: number;
    nj: number;

    w : number;
    h: number;
    d : number;

    fx : string;
    fy : string;
    fz : string;
}

export class CoreEntity extends ClientEntity {
    private roleMembers: {[key: string]: string[]} = {};

    noAdminsYet(): boolean {
        return !this.roleMembers['admin'];
    }

    getRoleMembersIds(role: string): string[] {
        if (!this.roleMembers[role]) {
            return [];
        }
        return this.roleMembers[role];
    }

    grantRole(role : string, userId: string): void {
        if (!this.roleMembers[role]) {
            this.roleMembers[role] = [];
        }
        this.roleMembers[role].push(userId);
    }

    hasRole(role: string, userId: string): boolean {
        if (role == 'admin' && !this.roleMembers['admin']) {
            return true;
        }
        if (!this.roleMembers[role]) {
            return false;
        }
        for (var userIdCandidate of this.roleMembers[role]) {
            if (userIdCandidate == userId) {
                return true;
            }
        }
        return false;
    }

    revokeRole(role: string, userId: string): void {
        if (!this.roleMembers[role]) {
            return;
        }
        this.roleMembers[role].splice(this.roleMembers[role].indexOf(userId), 1);
    }

}