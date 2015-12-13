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
    IdRegister.prototype.processReceivedIdPair = function (id, oid, idOidMap, oidIdMap) {
        if (idOidMap[id]) {
            return idOidMap[id];
        }
        if (oid) {
            oidIdMap[oid] = id;
            idOidMap[id] = oid;
            this.reserveId(oid);
            return oid;
        }
        else if (!oid) {
            var newOid = '' + this.getNewId();
            oidIdMap[newOid] = id;
            idOidMap[id] = newOid;
            return newOid;
        }
    };
    return IdRegister;
})();
exports.IdRegister = IdRegister;
