var IdRegister = (function () {
    function IdRegister() {
        this.entityIdCounter = 1;
    }
    IdRegister.prototype.reserveId = function (oid) {
        this.entityIdCounter = Math.max(this.entityIdCounter, Number(oid));
    };
    IdRegister.prototype.getNewId = function () {
        this.entityIdCounter++;
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
    return IdRegister;
})();
exports.IdRegister = IdRegister;
