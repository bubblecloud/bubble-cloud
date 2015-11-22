var AvatarController = (function () {
    function AvatarController(engine) {
        this.running = false;
        this.engine = engine;
    }
    AvatarController.prototype.startup = function () {
        this.startTimeMillis = new Date().getTime();
        this.avatar = new Entity();
        this.avatar.newId();
        this.avatar.dynamic = true;
        this.avatar.position.x = 3 * Math.cos(2 * Math.PI * 0);
        this.avatar.position.z = 3 * Math.sin(2 * Math.PI * 0);
        this.avatar.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2 * Math.PI * 0, 0, 0);
        this.engine.ws.sendObject(this.avatar);
        this.running = true;
    };
    AvatarController.prototype.shutdown = function () {
        this.running = false;
    };
    AvatarController.prototype.loop = function (timeMillis, timeDeltaMillis) {
        if (this.running) {
            this.avatar.position.x = 3 * Math.cos(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000));
            this.avatar.position.z = 3 * Math.sin(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000));
            this.avatar.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000), 0, 0);
            this.engine.ws.sendObject({
                'id': this.avatar.id,
                'position': this.avatar.position,
                'rotationQuaternion': this.avatar.rotationQuaternion
            });
        }
    };
    return AvatarController;
})();
