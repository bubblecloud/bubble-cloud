var hud_1 = require("../hud");
var Vector3 = BABYLON.Vector3;
var EntityScale = (function () {
    function EntityScale() {
        this.engine = hud_1.getClientEngine();
    }
    EntityScale.prototype.scale = function (scale) {
        var entity = this.engine.state.getEditedEntity();
        if (entity) {
            entity.scaling.addInPlace(scale.scaleInPlace(this.engine.grid.scaleStep));
            this.engine.ws.sendObject(entity);
        }
    };
    EntityScale.prototype.forward = function () {
        this.scale(new Vector3(0, 0, 1));
    };
    EntityScale.prototype.backward = function () {
        this.scale(new Vector3(0, 0, -1));
    };
    EntityScale.prototype.left = function () {
        this.scale(new Vector3(-1, 0, 0));
    };
    EntityScale.prototype.right = function () {
        this.scale(new Vector3(1, 0, 0));
    };
    EntityScale.prototype.up = function () {
        this.scale(new Vector3(0, 1, 0));
    };
    EntityScale.prototype.down = function () {
        this.scale(new Vector3(0, -1, 0));
    };
    return EntityScale;
})();
exports.EntityScale = EntityScale;
