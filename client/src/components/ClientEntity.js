var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector3 = BABYLON.Vector3;
var Quaternion = BABYLON.Quaternion;
var entityIdCounter = 0;
var ClientEntity = (function () {
    function ClientEntity() {
        this.position = new Vector3(0, 0, 0);
        this.rotationQuaternion = new Quaternion();
        this.scaling = new Vector3(0, 0, 0);
        this.core = false;
        this.removed = false;
        this.external = false;
        this.dynamic = false;
    }
    ClientEntity.prototype.newId = function () {
        entityIdCounter++;
        this.id = '' + entityIdCounter;
    };
    return ClientEntity;
})();
exports.ClientEntity = ClientEntity;
var CoreEntity = (function (_super) {
    __extends(CoreEntity, _super);
    function CoreEntity() {
        _super.apply(this, arguments);
        this.roleMembers = {};
    }
    CoreEntity.prototype.grantRole = function (role, userId) {
        if (!this.roleMembers[role]) {
            this.roleMembers[role] = [];
        }
        this.roleMembers[role].push(userId);
    };
    CoreEntity.prototype.hasRole = function (role, userId) {
        if (role == 'admin' && !this.roleMembers['admin']) {
            return true;
        }
        if (!this.roleMembers[role]) {
            return false;
        }
        for (var _i = 0, _a = this.roleMembers[role]; _i < _a.length; _i++) {
            var userIdCandidate = _a[_i];
            if (userIdCandidate == userId) {
                return true;
            }
        }
        return false;
    };
    CoreEntity.prototype.revokeRole = function (role, userId) {
        if (!this.roleMembers[role]) {
            return;
        }
        this.roleMembers[role].splice(this.roleMembers[role].indexOf(userId), 1);
    };
    return CoreEntity;
})(ClientEntity);
exports.CoreEntity = CoreEntity;
