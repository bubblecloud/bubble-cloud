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

            //Pressing W
            if (pressedKeys.forward) {
                this.avatar.position = this.avatar.position.add(new BABYLON.Vector3(0, 0, 1).scale(this.velocity * timeDeltaMillis / 1000.0));
            }
            //Pressing S
            if (pressedKeys.back) {
                this.avatar.position = this.avatar.position.add(new BABYLON.Vector3(0, 0, -1).scale(this.velocity * timeDeltaMillis / 1000.0));
            }
            //Pressing A
            if (pressedKeys.left) {
                this.avatar.position = this.avatar.position.add(new BABYLON.Vector3(-1, 0, 0).scale(this.velocity * timeDeltaMillis / 1000.0));
            }
            //Pressing D
            if (pressedKeys.right) {
                this.avatar.position = this.avatar.position.add(new BABYLON.Vector3(1, 0, 0).scale(this.velocity * timeDeltaMillis / 1000.0));
            }

            this.engine.ws.sendObject({
                'id': this.avatar.id,
                'position': this.avatar.position,
                'rotationQuaternion': this.avatar.rotationQuaternion
            });
        }
    }
}