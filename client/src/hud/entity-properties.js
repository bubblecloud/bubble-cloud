var hud_1 = require("../hud");
var Vector3 = BABYLON.Vector3;
var Quaternion = BABYLON.Quaternion;
var EntityProperties = (function () {
    function EntityProperties() {
        this.engine = hud_1.getClientEngine();
        this.state = this.engine.state;
        this.state.addClientStateListener(this);
    }
    EntityProperties.prototype.stateChange = function () {
        var editedEntity = this.state.getEditedEntity();
        if (editedEntity && this.engine.model.oidIdMap[editedEntity.id]) {
            var id = this.engine.model.oidIdMap[editedEntity.id];
            this.entity = this.engine.model.entities[id];
            this.position = new Vector3(this.entity.position.x, this.entity.position.y, this.entity.position.z);
            var rotationQuaternion = new Quaternion();
            rotationQuaternion.copyFrom(this.entity.rotationQuaternion);
            this.rotation = rotationQuaternion.toEulerAngles();
            this.rotation.scaleInPlace(180 / Math.PI);
            this.scaling = new Vector3(this.entity.scaling.x, this.entity.scaling.y, this.entity.scaling.z);
        }
        else {
            this.position = null;
            this.rotation = null;
            this.scaling = null;
        }
    };
    return EntityProperties;
})();
exports.EntityProperties = EntityProperties;
