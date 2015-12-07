var ClientEntity_1 = require("./ClientEntity");
var Matrix = BABYLON.Matrix;
var Vector3 = BABYLON.Vector3;
var Quaternion = BABYLON.Quaternion;
var AvatarController = (function () {
    function AvatarController(engine) {
        this.running = false;
        this.velocity = 2;
        this.cameraHeightOffset = 5;
        this.engine = engine;
    }
    AvatarController.prototype.startup = function () {
        this.startTimeMillis = new Date().getTime();
        this.avatar = new ClientEntity_1.ClientEntity();
        this.avatar.id = '0';
        this.avatar.repo = 'default';
        this.avatar.type = 'water-world-sphere';
        this.avatar.dynamic = true;
        this.avatar.scaling.scaleInPlace(0.8);
        this.engine.ws.sendObject(this.avatar);
        this.running = true;
    };
    AvatarController.prototype.shutdown = function () {
        this.running = false;
    };
    AvatarController.prototype.loop = function (timeMillis, timeDeltaMillis) {
        if (this.running) {
            this.engine.ws.sendObject({
                'id': this.avatar.id,
                'position': this.avatar.position,
                'rotationQuaternion': this.avatar.rotationQuaternion
            });
        }
    };
    AvatarController.prototype.renderLoop = function (timeMillis, timeDeltaMillis) {
        if (this.running) {
            var pressedKeys = this.engine.keyboardReader.getPressedKeys();
            var rotationMatrix = new Matrix();
            this.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            if (pressedKeys.forward) {
                this.avatar.position = this.avatar.position.add(Vector3.TransformCoordinates(new Vector3(0, 0, 1).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            if (pressedKeys.back) {
                this.avatar.position = this.avatar.position.add(Vector3.TransformCoordinates(new Vector3(0, 0, -1).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            if (pressedKeys.left) {
                this.avatar.position = this.avatar.position.add(Vector3.TransformCoordinates(new Vector3(-1, 0, 0).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            if (pressedKeys.right) {
                this.avatar.position = this.avatar.position.add(Vector3.TransformCoordinates(new Vector3(1, 0, 0).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            if (pressedKeys.up) {
                this.avatar.position = this.avatar.position.add(Vector3.TransformCoordinates(new Vector3(0, 1, 0).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            if (pressedKeys.down) {
                this.avatar.position = this.avatar.position.add(Vector3.TransformCoordinates(new Vector3(0, -1, 0).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            var clientWidth = document.documentElement.clientWidth;
            var clientHeight = document.documentElement.clientHeight;
            var mouseMovementX = this.engine.mouseReader.popMovementX();
            var mouseMovementY = this.engine.mouseReader.popMovementY();
            var relativeX = mouseMovementX / ((1.0) * clientWidth);
            var relativeY = mouseMovementY / ((1.0) * clientHeight);
            var yawRotation = Quaternion.RotationAxis(new Vector3(0, 1, 0), relativeX * Math.PI);
            var pitchRotation = Quaternion.RotationAxis(new Vector3(1, 0, 0), relativeY * Math.PI);
            this.avatar.rotationQuaternion = yawRotation.multiply(this.avatar.rotationQuaternion).multiply(pitchRotation);
        }
    };
    return AvatarController;
})();
exports.AvatarController = AvatarController;
