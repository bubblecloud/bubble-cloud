/**
 * Class for keeping track of IDs.
 */
export class IdRegister {
    entityIdCounter: number = 1;

    reserveId(oid: string) {
        this.entityIdCounter = Math.max(this.entityIdCounter, Number(oid));
    }

    getNewId() : number {
        this.entityIdCounter++;
        return this.entityIdCounter;
    }

    processReceivedIdPair(id: string, oid: string, idOidMap : {[key: string]: string}, oidIdMap : {[key: string]: string}): string {
        if (idOidMap[id]) {
            // If id is already mapped then return the oid.
            return idOidMap[id];
        }
        if (oid) {
            // If id was not mapped and oid was returned. (Remote peer has received ID from this instance.)
            oidIdMap[oid] = id;
            idOidMap[id] = oid;
            this.reserveId(oid);
            return oid;
        } else if (!oid) {
            // Reserve new ID.
            var newOid = '' + this.getNewId();
            oidIdMap[newOid] = id;
            idOidMap[id] = newOid;
            return newOid;
        }
    }
}