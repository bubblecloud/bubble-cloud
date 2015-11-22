class AvatarController {
    running: boolean = false;
    engine: Engine;
    avatar: Entity;
    startTimeMillis: number;
    velocity: number = 2;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    startup() {
        this.startTimeMillis = new Date().getTime();
        this.avatar = new Entity();
        this.avatar.newId();
        this.avatar.dynamic = true;
        /*this.avatar.position.x = 3 * Math.cos(2 * Math.PI * 0);
        this.avatar.position.z = 3 * Math.sin(2 * Math.PI * 0);
        this.avatar.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2 * Math.PI * 0, 0, 0);*/
        this.engine.ws.sendObject(this.avatar);
        this.running = true;
    }

    shutdown() {
        this.running = false;
    }

    loop(timeMillis: number, timeDeltaMillis: number): void {
        if (this.running) {
            /*this.avatar.position.x = 3 * Math.cos(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000));
            this.avatar.position.z = 3 * Math.sin(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000));
            this.avatar.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000), 0, 0);*/
            var pressedKeys = this.engine.keyboardReader.getPressedKeys()

            var rotationMatrix = new BABYLON.Matrix();
            this.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            //Pressing W
            if (pressedKeys.forward) {
                this.avatar.position = this.avatar.position.add(BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, 1).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            //Pressing S
            if (pressedKeys.back) {
                this.avatar.position = this.avatar.position.add(BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, -1).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            //Pressing A
            if (pressedKeys.left) {
                this.avatar.position = this.avatar.position.add(BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(-1, 0, 0).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            //Pressing D
            if (pressedKeys.right) {
                this.avatar.position = this.avatar.position.add(BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(1, 0, 0).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }

            var clientWidth = document.documentElement.clientWidth;
            var clientHeight = document.documentElement.clientHeight;
            var mouseMovementX = this.engine.mouseReader.popMovementX();
            var mouseMovementY = this.engine.mouseReader.popMovementY();
            var relativeX = mouseMovementX / ((1.0) * clientWidth);
            var relativeY = mouseMovementY / ((1.0) * clientHeight);

            var yawRotation: BABYLON.Quaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 1, 0), relativeX * Math.PI);
            var pitchRotation: BABYLON.Quaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(1, 0, 0), relativeY * Math.PI);

            this.avatar.rotationQuaternion = yawRotation.multiply(this.avatar.rotationQuaternion).multiply(pitchRotation);

            this.engine.ws.sendObject({
                'id': this.avatar.id,
                'position': this.avatar.position,
                'rotationQuaternion': this.avatar.rotationQuaternion
            });
        }
    }
}