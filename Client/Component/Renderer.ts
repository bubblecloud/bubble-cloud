/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../../typings/babylonjs/babylonjs.d.ts" />

class Renderer {

    model: ClientModel;
    keyboardReader: KeyboardReader;

    clientEngine: ClientEngine;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
    camera: BABYLON.FollowCamera;

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
        var shape = BABYLON.Mesh.CreateBox(entity.id, 1, this.scene);
        shape.position = entity.interpolatedPosition
        shape.rotationQuaternion = entity.interpolatedRotationQuaternion
        if (entity.oid == this.clientEngine.avatarController.avatar.id) {
            this.camera.target = shape;
            /*var rotationMatrix = new BABYLON.Matrix();
            entity.interpolatedRotationQuaternion.toRotationMatrix(rotationMatrix);
            var relativeCameraPosition = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, -10), rotationMatrix);
            this.camera.heightOffset = 2 + relativeCameraPosition.y;*/
        }
    }

    onUpdate(entity: ClientEntity) {
        var shape = this.scene.getMeshByName(entity.id);
        shape.position = entity.interpolatedPosition;
        shape.rotationQuaternion = entity.interpolatedRotationQuaternion;
        /*if (entity.oid == this.clientEngine.avatarController.avatar.id) {
            var rotationMatrix = new BABYLON.Matrix();
            entity.interpolatedRotationQuaternion.toRotationMatrix(rotationMatrix);
            var relativeCameraPosition = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0, 0, -10), rotationMatrix);
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

        if (BABYLON.Engine.isSupported()) {
            // Load the BABYLON 3D engine
            this.engine = new BABYLON.Engine(canvas, true);

            // This begins the creation of a function that we will 'call' just after it's built
            var createScene = () => {
                // Now create a basic Babylon Scene object
                this.scene = new BABYLON.Scene(this.engine);

                // Change the scene background color to green.
                this.scene.clearColor = new BABYLON.Color3(151/255, 147/255, 198/255);

                // This creates and positions a free camera
                //this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

                // This targets the camera to scene origin
                //this.camera.setTarget(BABYLON.Vector3.Zero());

                // This attaches the camera to the canvas
                //this.camera.attachControl(canvas, false);

                this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), this.scene);
                this.camera.heightOffset = 5;
                this.camera.radius = 10;
                this.camera.rotationOffset = 180;
                //this.camera.setTarget(BABYLON.Vector3.Zero());

                // This creates a light, aiming 0,1,0 - to the sky.
                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);

                // Dim the light a small amount
                light.intensity = .5;

                // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
                //var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this.scene);

                // Move the sphere upward 1/2 its height
                //sphere.position.y = 1;

                // Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
                //var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, this.scene);

                // Leave this function
                return this.scene;

            };  // End of createScene function

            // Now, call the createScene function that you just finished creating
            this.scene = createScene();

            // Register a render loop to repeatedly render the scene
            this.engine.runRenderLoop(() => {
                this.model.interpolate();
                this.scene.render();
                //console.log(this.engine.getFps().toFixed());
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