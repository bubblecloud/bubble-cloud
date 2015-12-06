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
    EntityRotate.prototype.reset = function () {
        var entity = this.engine.state.editedEntity;
        if (entity) {
            entity.rotationQuaternion = new Quaternion();
            this.engine.ws.sendObject(entity);
        }
    };
    EntityRotate.prototype.pitchUp = function () {
        this.rotate(new Vector3(-1, 0, 0));
    };
    EntityRotate.prototype.pitchDown = function () {
        this.rotate(new Vector3(1, 0, 0));
    };
    EntityRotate.prototype.yawLeft = function () {
        this.rotate(new Vector3(0, -1, 0));
    };
    EntityRotate.prototype.yawRight = function () {
        this.rotate(new Vector3(0, 1, 0));
    };
    EntityRotate.prototype.rollRight = function () {
        this.rotate(new Vector3(0, 0, -1));
    };
    EntityRotate.prototype.rollLeft = function () {
        this.rotate(new Vector3(0, 0, 1));
    };
    return EntityRotate;
})();
exports.EntityRotate = EntityRotate;
