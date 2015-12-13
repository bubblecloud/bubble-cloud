var IdRegister = (function () {
    function IdRegister() {
        this.entityIdCounter = 1;
    }
    IdRegister.prototype.reserveId = function (oid) {
        this.entityIdCounter = Math.max(this.entityIdCounter, Number(oid));
        console.log("registered loaded ID: " + oid);
    };
    IdRegister.prototype.getNewId = function () {
        this.entityIdCounter++;
        console.log("registered new ID: " + this.entityIdCounter);
        return this.entityIdCounter;
    };
    IdRegister.prototype.processReceivedIdPair = function (localId, remoteId, localIdRemoteIdMap, remoteIdLocalIdMap) {
        if (remoteIdLocalIdMap[remoteId]) {
            return remoteIdLocalIdMap[remoteId];
        }
        if (localId) {
            localIdRemoteIdMap[localId] = remoteId;
            remoteIdLocalIdMap[remoteId] = localId;
            this.reserveId(localId);
            return localId;
        }
        else if (!localId) {
            var newLocalId = '' + this.getNewId();
            localIdRemoteIdMap[newLocalId] = remoteId;
            remoteIdLocalIdMap[remoteId] = newLocalId;
            return newLocalId;
        }
    };
    IdRegister.prototype.mapIdsOfReceivedEntity = function (entity, localIdRemoteIdMap, remoteIdLocalIdMap) {
        var id = entity.id;
        entity.id = entity.rid;
        entity.rid = id;
        var pid = entity.pid;
        entity.pid = entity.prid;
        entity.prid = pid;
        entity.id = this.processReceivedIdPair(entity.id, entity.rid, localIdRemoteIdMap, remoteIdLocalIdMap);
        if (entity.prid) {
            entity.pid = this.processReceivedIdPair(entity.pid, entity.prid, localIdRemoteIdMap, remoteIdLocalIdMap);
        }
        else {
            entity.pid = null;
            entity.prid = null;
        }
    };
    return IdRegister;
})();
exports.IdRegister = IdRegister;
