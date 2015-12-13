var hud_1 = require("../hud");
var Matrix = BABYLON.Matrix;
var Vector3 = BABYLON.Vector3;
var EntityTranslate = (function () {
    function EntityTranslate() {
        this.engine = hud_1.getClientEngine();
    }
    EntityTranslate.prototype.translate = function (translation) {
        var entity = this.engine.state.getEditedEntity();
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(translation.scale(this.engine.grid.positionStep), rotationMatrix);
            if (entity.pid) {
                var mesh = this.engine.renderer.scene.getMeshByName(entity.pid);
                var worldMatrix = mesh.getWorldMatrix();
                var worldMatrixInverted = new Matrix();
                worldMatrix.invertToRef(worldMatrixInverted);
                var entityWorldPosition = BABYLON.Vector3.TransformCoordinates(entity.position, worldMatrix);
                entityWorldPosition = entityWorldPosition.add(stepDirection);
                entity.position = BABYLON.Vector3.TransformCoordinates(entityWorldPosition, worldMatrixInverted);
            }
            else {
                entity.position = entity.position.add(stepDirection);
            }
            this.engine.ws.sendObject(entity);
        }
    };
    EntityTranslate.prototype.forward = function () {
        this.translate(new Vector3(0, 0, 1));
    };
    EntityTranslate.prototype.backward = function () {
        this.translate(new Vector3(0, 0, -1));
    };
    EntityTranslate.prototype.left = function () {
        this.translate(new Vector3(-1, 0, 0));
    };
    EntityTranslate.prototype.right = function () {
        this.translate(new Vector3(1, 0, 0));
    };
    EntityTranslate.prototype.up = function () {
        this.translate(new Vector3(0, 1, 0));
    };
    EntityTranslate.prototype.down = function () {
        this.translate(new Vector3(0, -1, 0));
    };
    return EntityTranslate;
})();
exports.EntityTranslate = EntityTranslate;
