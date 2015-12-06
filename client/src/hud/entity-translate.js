var hud_1 = require("../hud");
var Matrix = BABYLON.Matrix;
var Vector3 = BABYLON.Vector3;
var EntityTranslate = (function () {
    function EntityTranslate() {
        this.engine = hud_1.getClientEngine();
    }
    EntityTranslate.prototype.forward = function () {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(new Vector3(0, 0, 1.4 * this.engine.grid.positionStep), rotationMatrix);
            entity.position.addInPlace(stepDirection);
            entity.position = this.engine.grid.positionSnap(entity.position);
            this.engine.ws.sendObject(entity);
        }
    };
    EntityTranslate.prototype.backward = function () {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(new Vector3(0, 0, -1.4 * this.engine.grid.positionStep), rotationMatrix);
            entity.position.addInPlace(stepDirection);
            entity.position = this.engine.grid.positionSnap(entity.position);
            this.engine.ws.sendObject(entity);
        }
    };
    EntityTranslate.prototype.left = function () {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(new Vector3(-1.4 * this.engine.grid.positionStep, 0, 0), rotationMatrix);
            entity.position.addInPlace(stepDirection);
            entity.position = this.engine.grid.positionSnap(entity.position);
            this.engine.ws.sendObject(entity);
        }
    };
    EntityTranslate.prototype.right = function () {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(new Vector3(1.4 * this.engine.grid.positionStep, 0, 0), rotationMatrix);
            entity.position.addInPlace(stepDirection);
            entity.position = this.engine.grid.positionSnap(entity.position);
            this.engine.ws.sendObject(entity);
        }
    };
    EntityTranslate.prototype.up = function () {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(new Vector3(0, 1.4 * this.engine.grid.positionStep, 0), rotationMatrix);
            entity.position.addInPlace(stepDirection);
            entity.position = this.engine.grid.positionSnap(entity.position);
            this.engine.ws.sendObject(entity);
        }
    };
    EntityTranslate.prototype.down = function () {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var rotationMatrix = new Matrix();
            this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            var stepDirection = Vector3.TransformCoordinates(new Vector3(0, -1.4 * this.engine.grid.positionStep, 0), rotationMatrix);
            entity.position.addInPlace(stepDirection);
            entity.position = this.engine.grid.positionSnap(entity.position);
            this.engine.ws.sendObject(entity);
        }
    };
    return EntityTranslate;
})();
exports.EntityTranslate = EntityTranslate;
