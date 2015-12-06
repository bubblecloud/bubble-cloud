var hud_1 = require("../hud");
var EntityProperties = (function () {
    function EntityProperties() {
        this.engine = hud_1.getClientEngine();
        this.state = this.engine.state;
        this.state.addClientStateListener(this);
    }
    EntityProperties.prototype.stateChange = function () {
        this.entity = this.state.getEditedEntity();
        if (this.entity) {
            this.position = this.entity.position.clone();
            this.rotation = this.entity.rotationQuaternion.toEulerAngles();
            this.scaling = this.entity.scaling.clone();
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
