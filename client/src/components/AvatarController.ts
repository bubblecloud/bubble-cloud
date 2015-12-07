import {ClientEngine} from "./ClientEngine";
import {ClientEntity} from "./ClientEntity";
import Matrix = BABYLON.Matrix;
import Vector3 = BABYLON.Vector3;
import Quaternion = BABYLON.Quaternion;
export class AvatarController {
    running: boolean = false;
    engine: ClientEngine;
    avatar: ClientEntity;
    startTimeMillis: number;
    velocity: number = 2;
    cameraHeightOffset: number = 5;

    constructor(engine: ClientEngine) {
        this.engine = engine;
    }

    startup() {
        this.startTimeMillis = new Date().getTime();
        this.avatar = new ClientEntity();
        this.avatar.id = '0';
        this.avatar.repo = 'default';
        this.avatar.type = 'water-world-sphere';
        this.avatar.dynamic = true;
        this.avatar.scaling.x = 0.25;
        this.avatar.scaling.y = 0.5;
        this.avatar.scaling.z = 1.5;
        /*this.avatar.position.x = 3 * Math.cos(2 * Math.PI * 0);
        this.avatar.position.z = 3 * Math.sin(2 * Math.PI * 0);
        this.avatar.rotationQuaternion = Quaternion.RotationYawPitchRoll(2 * Math.PI * 0, 0, 0);*/
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
            this.avatar.rotationQuaternion = Quaternion.RotationYawPitchRoll(2 * Math.PI * ((timeMillis - this.startTimeMillis) / 10000), 0, 0);*/

            this.engine.ws.sendObject({
                'id': this.avatar.id,
                'position': this.avatar.position,
                'rotationQuaternion': this.avatar.rotationQuaternion
            });
        }
    }

    renderLoop(timeMillis: number, timeDeltaMillis: number): void {
        if (this.running) {

            var pressedKeys = this.engine.keyboardReader.getPressedKeys()

            var rotationMatrix = new Matrix();
            this.avatar.rotationQuaternion.toRotationMatrix(rotationMatrix);
            //Pressing W
            if (pressedKeys.forward) {
                this.avatar.position = this.avatar.position.add(Vector3.TransformCoordinates(new Vector3(0, 0, 1).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            //Pressing S
            if (pressedKeys.back) {
                this.avatar.position = this.avatar.position.add(Vector3.TransformCoordinates(new Vector3(0, 0, -1).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            //Pressing A
            if (pressedKeys.left) {
                this.avatar.position = this.avatar.position.add(Vector3.TransformCoordinates(new Vector3(-1, 0, 0).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            //Pressing D
            if (pressedKeys.right) {
                this.avatar.position = this.avatar.position.add(Vector3.TransformCoordinates(new Vector3(1, 0, 0).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            //Pressing E
            if (pressedKeys.up) {
                this.avatar.position = this.avatar.position.add(Vector3.TransformCoordinates(new Vector3(0, 1, 0).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }
            //Pressing Q
            if (pressedKeys.down) {
                this.avatar.position = this.avatar.position.add(Vector3.TransformCoordinates(new Vector3(0, -1, 0).scale(this.velocity * timeDeltaMillis / 1000.0), rotationMatrix));
            }


            var clientWidth = document.documentElement.clientWidth;
            var clientHeight = document.documentElement.clientHeight;
            var mouseMovementX = this.engine.mouseReader.popMovementX();
            var mouseMovementY = this.engine.mouseReader.popMovementY();
            var relativeX = mouseMovementX / ((1.0) * clientWidth);
            var relativeY = mouseMovementY / ((1.0) * clientHeight);

            var yawRotation:Quaternion = Quaternion.RotationAxis(new Vector3(0, 1, 0), relativeX * Math.PI);
            var pitchRotation:Quaternion = Quaternion.RotationAxis(new Vector3(1, 0, 0), relativeY * Math.PI);

            this.avatar.rotationQuaternion = yawRotation.multiply(this.avatar.rotationQuaternion).multiply(pitchRotation);
        }
    }
}