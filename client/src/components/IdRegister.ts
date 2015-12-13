import {ServerEntity} from "../../../server/Component/ServerEntity";
import {Entity} from "./Entity";
/**
 * Class for keeping track of IDs.
 */
export class IdRegister {
    entityIdCounter: number = 1;

    reserveId(oid: string) {
        this.entityIdCounter = Math.max(this.entityIdCounter, Number(oid));
        console.log("registered loaded ID: " + oid);
    }

    getNewId() : number {
        this.entityIdCounter++;
        console.log("registered new ID: " + this.entityIdCounter);
        return this.entityIdCounter;
    }

    processReceivedIdPair(localId: string, remoteId: string, localIdRemoteIdMap : {[key: string]: string}, remoteIdLocalIdMap : {[key: string]: string}): string {
        if (remoteIdLocalIdMap[remoteId]) {
            // If remote ID is already mapped to local ID then return the mapped local ID.
            return remoteIdLocalIdMap[remoteId];
        }
        if (localId) {
            // If remote ID  was not mapped and local ID was returned from remote per. (Remote peer has received ID from this instance.)
            // Map the received remote ID and local ID.
            localIdRemoteIdMap[localId] = remoteId;
            remoteIdLocalIdMap[remoteId] = localId;
            // Reserve the remotely received ID from local ID registry just in case.
            this.reserveId(localId);
            // Return the received local ID.
            return localId;
        } else if (!localId) {
            // No already mapped local ID and peer did not return local ID.
            // Reserve new ID.
            var newLocalId = '' + this.getNewId();
            // Map the new local ID.
            localIdRemoteIdMap[newLocalId] = remoteId;
            remoteIdLocalIdMap[remoteId] = newLocalId;
            // Return the new local ID.
            return newLocalId;
        }
    }

    mapIdsOfReceivedEntity(entity: Entity, localIdRemoteIdMap : {[key: string]: string}, remoteIdLocalIdMap : {[key: string]: string}): void {
        // Swap to local IDs
        var id = entity.id;
        entity.id = entity.rid;
        entity.rid = id;
        var pid = entity.pid;
        entity.pid = entity.prid;
        entity.prid = pid;

        entity.id = this.processReceivedIdPair(entity.id, entity.rid, localIdRemoteIdMap, remoteIdLocalIdMap);
        if (entity.prid) {
            entity.pid = this.processReceivedIdPair(entity.pid, entity.prid, localIdRemoteIdMap, remoteIdLocalIdMap);
        } else {
            entity.pid = null;
            entity.prid = null;
        }
    }
}