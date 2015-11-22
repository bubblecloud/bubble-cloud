var AvatarController = (function () {
    function AvatarController(engine) {
        this.running = false;
        this.velocity = 2;
        this.engine = engine;
    }
    AvatarController.prototype.startup = function () {
        this.startTimeMillis = new Date().getTime();
        this.avatar = new Entity();
        this.avatar.newId();
        this.avatar.dynamic = true;
        this.engine.ws.sendObject(this.avatar);
        this.running = true;
    };
    AvatarController.prototype.shutdown = function () {
        this.running = false;
    };
    AvatarController.prototype.loop = function (timeMillis, timeDeltaMillis) {
        if (this.running) {
            var pressedKeys = this.engine.keyboardReader.getPressedKeys();
            if (pressedKeys.forward) {
                this.avatar.position = this.avatar.position.add(new BABYLON.Vector3(0, 0, 1).scale(this.velocity * timeDeltaMillis / 1000.0));
            }
            if (pressedKeys.back) {
                this.avatar.position = this.avatar.position.add(new BABYLON.Vector3(0, 0, -1).scale(this.velocity * timeDeltaMillis / 1000.0));
            }
            if (pressedKeys.left) {
                this.avatar.position = this.avatar.position.add(new BABYLON.Vector3(-1, 0, 0).scale(this.velocity * timeDeltaMillis / 1000.0));
            }
            if (pressedKeys.right) {
                this.avatar.position = this.avatar.position.add(new BABYLON.Vector3(1, 0, 0).scale(this.velocity * timeDeltaMillis / 1000.0));
            }
            this.engine.ws.sendObject({
                'id': this.avatar.id,
                'position': this.avatar.position,
                'rotationQuaternion': this.avatar.rotationQuaternion
            });
        }
    };
    return AvatarController;
})();