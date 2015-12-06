var hud_1 = require("../hud");
var Matrix = BABYLON.Matrix;
var Vector3 = BABYLON.Vector3;
var Quaternion = BABYLON.Quaternion;
var EntityRotate = (function () {
    function EntityRotate() {
        this.engine = hud_1.getClientEngine();
    }
    EntityRotate.prototype.rotate = function (rotationAxis) {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            var currentRotationMatrix = new Matrix();
            entity.rotationQuaternion.toRotationMatrix(currentRotationMatrix);
            var localRotationAxis = Vector3.TransformCoordinates(rotationAxis, currentRotationMatrix);
            var rotationQuaternion = Quaternion.RotationAxis(localRotationAxis, Math.PI * this.engine.grid.rotationStep / 180);
            var rotationMatrix = new Matrix();
            rotationQuaternion.toRotationMatrix(rotationMatrix);
            entity.rotationQuaternion.fromRotationMatrix(currentRotationMatrix.multiply(rotationMatrix));
            entity.rotationQuaternion.normalize();
            this.engine.ws.sendObject(entity);
        }
    };
    EntityRotate.prototype.forward = function () {
        this.rotate(new Vector3(1, 0, 0));
    };
    EntityRotate.prototype.backward = function () {
        this.rotate(new Vector3(-1, 0, 0));
    };
    EntityRotate.prototype.left = function () {
        this.rotate(new Vector3(0, -1, 0));
    };
    EntityRotate.prototype.right = function () {
        this.rotate(new Vector3(0, 1, 0));
    };
    EntityRotate.prototype.up = function () {
        this.rotate(new Vector3(0, 0, -1));
    };
    EntityRotate.prototype.down = function () {
        this.rotate(new Vector3(0, 0, 1));
    };
    return EntityRotate;
})();
exports.EntityRotate = EntityRotate;
