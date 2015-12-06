var Vector3 = BABYLON.Vector3;
var Quaternion = BABYLON.Quaternion;
var ClientGrid = (function () {
    function ClientGrid() {
        this.positionStep = 0.2;
        this.positionOffset = 0;
        this.rotationStep = 1;
        this.rotationOffset = 0;
        this.scaleStep = 0.1;
        this.scaleOffset = 0;
    }
    ClientGrid.prototype.positionSnap = function (position) {
        return new Vector3(this.snap(position.x, this.positionStep, this.positionOffset), this.snap(position.y, this.positionStep, this.positionOffset), this.snap(position.z, this.positionStep, this.positionOffset));
    };
    ClientGrid.prototype.rotationSnap = function (rotationQuaternion) {
        var rotation = rotationQuaternion.toEulerAngles();
        var snappedRotation = new Vector3(this.snap(rotation.x, this.rotationStep, this.rotationOffset), this.snap(rotation.y, this.rotationStep, this.rotationOffset), this.snap(rotation.z, this.rotationStep, this.rotationOffset));
        return Quaternion.RotationYawPitchRoll(snappedRotation.y, snappedRotation.x, snappedRotation.z);
    };
    ClientGrid.prototype.scaleSnap = function (scale) {
        return new Vector3(this.snap(scale.x, this.scaleStep, this.scaleOffset), this.snap(scale.y, this.scaleStep, this.scaleOffset), this.snap(scale.z, this.scaleStep, this.scaleOffset));
    };
    ClientGrid.prototype.snap = function (value, step, offset) {
        return Math.round((value - offset) / step) * step + offset;
    };
    return ClientGrid;
})();
exports.ClientGrid = ClientGrid;
