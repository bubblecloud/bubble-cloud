import {ClientModel} from "./ClientModel";
import {KeyboardReader} from "./KeyboardReader";
import {ClientEngine} from "./ClientEngine";
import {ClientEntity} from "./ClientEntity";

import Engine = BABYLON.Engine;
import Scene = BABYLON.Scene;
import TargetCamera = BABYLON.TargetCamera;
import Mesh = BABYLON.Mesh;
import Color3 = BABYLON.Color3;
import Vector3 = BABYLON.Vector3;
import HemisphericLight = BABYLON.HemisphericLight;
import Matrix = BABYLON.Matrix;

export class Renderer {

    model: ClientModel;
    keyboardReader: KeyboardReader;

    clientEngine: ClientEngine;
    engine: Engine;
    scene: Scene;
    camera: TargetCamera;
    avatarShape: Mesh;

    lastLoopTimeMillis: number = new Date().getTime();

    constructor(clientEngine: ClientEngine, model: ClientModel, keyboardInputController: KeyboardReader) {
        this.clientEngine = clientEngine;
        this.model = model;
        this.keyboardReader = keyboardInputController;
        this.model.setOnAdd((entity: ClientEntity) => {
            this.onAdd(entity);
        });
        this.model.setOnUpdate((entity: ClientEntity) => {
            this.onUpdate(entity);
        });
        this.model.setOnRemove((entity: ClientEntity) => {
            this.onRemove(entity);
        });
    }

    onAdd(entity: ClientEntity) {
        //console.log('add:' + JSON.stringify(entity));
        // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
        var shape = Mesh.CreateBox(entity.id, 1, this.scene);
        shape.position = entity.interpolatedPosition;
        shape.rotationQuaternion = entity.interpolatedRotationQuaternion;
        if (entity.oid == this.clientEngine.avatarController.avatar.id) {
            this.avatarShape = Mesh.CreateBox(entity.id, 1, this.scene);
            shape.visibility = 0;
            /*var rotationMatrix = new Matrix();
            entity.interpolatedRotationQuaternion.toRotationMatrix(rotationMatrix);
            var relativeCameraPosition = Vector3.TransformCoordinates(new Vector3(0, 0, -10), rotationMatrix);
            this.camera.heightOffset = 2 + relativeCameraPosition.y;*/
        }
    }

    onUpdate(entity: ClientEntity) {
        var shape = this.scene.getMeshByName(entity.id);
        shape.position = entity.interpolatedPosition;
        shape.rotationQuaternion = entity.interpolatedRotationQuaternion;
        /*if (entity.oid == this.clientEngine.avatarController.avatar.id) {
            var rotationMatrix = new Matrix();
            entity.interpolatedRotationQuaternion.toRotationMatrix(rotationMatrix);
            var relativeCameraPosition = Vector3.TransformCoordinates(new Vector3(0, 0, -10), rotationMatrix);
            this.camera.heightOffset = 2 + relativeCameraPosition.y;
        }*/
    }

    onRemove(entity: ClientEntity) {
        //console.log('remove:' + JSON.stringify(entity));
        var shape = this.scene.getMeshByName(entity.id);
        this.scene.removeMesh(shape);
    }

    startup() {
        // Get the canvas element from our HTML above
        var canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("renderCanvas");

        if (!canvas) {
            return;
        }

        if (Engine.isSupported()) {
            // Load the BABYLON 3D engine
            this.engine = new Engine(canvas, true);

            // This begins the creation of a function that we will 'call' just after it's built
            var createScene = () => {
                // Now create a basic Babylon Scene object
                this.scene = new Scene(this.engine);

                // Change the scene background color to green.
                this.scene.clearColor = new Color3(151/255, 147/255, 198/255);

                // This creates and positions a free camera
                //this.camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);

                // This targets the camera to scene origin
                //this.camera.setTarget(Vector3.Zero());

                // This attaches the camera to the canvas
                //this.camera.attachControl(canvas, false);

                this.camera = new TargetCamera("AvatarCamera", new Vector3(0, 5, -10), this.scene);
                this.camera.setTarget(Vector3.Zero());

                // This creates a light, aiming 0,1,0 - to the sky.
                var light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);

                // Dim the light a small amount
                light.intensity = .5;

                // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
                //var sphere = Mesh.CreateSphere("sphere1", 16, 2, this.scene);

                // Move the sphere upward 1/2 its height
                //sphere.position.y = 1;

                // Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
                //var ground = Mesh.CreateGround("ground1", 6, 6, 2, this.scene);

                // Leave this function
                return this.scene;

            };  // End of createScene function

            // Now, call the createScene function that you just finished creating
            this.scene = createScene();

            // Register a render loop to repeatedly render the scene
            this.engine.runRenderLoop(() => {
                this.model.interpolate();
                this.scene.render();

                var timeMillis = (new Date).getTime();
                var timeDeltaMillis : number = timeMillis - this.lastLoopTimeMillis;

                if (this.clientEngine.running) {
                    this.clientEngine.avatarController.renderLoop(timeMillis, timeDeltaMillis);
                    if (this.avatarShape) {
                        this.avatarShape.position = this.clientEngine.avatarController.avatar.position;
                        this.avatarShape.rotationQuaternion = this.clientEngine.avatarController.avatar.rotationQuaternion;

                        var rotationMatrix = new Matrix();
                        this.avatarShape.rotationQuaternion.toRotationMatrix(rotationMatrix);
                        var cameraDirection = Vector3.TransformCoordinates(new Vector3(0, 5, -10), rotationMatrix)
                        this.camera.position = cameraDirection.add(this.avatarShape.position);
                        this.camera.setTarget(this.avatarShape.position);
                    }
                }

                this.lastLoopTimeMillis = timeMillis;

            });

            // Watch for browser/canvas resize events
            window.addEventListener("resize", () => {
                this.engine.resize();
            });
        }
    }

    shutdown() {
        this.engine.stopRenderLoop();
    }

}