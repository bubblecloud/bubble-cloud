/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../../typings/babylonjs/babylonjs.d.ts" />

class Renderer {

    model: Model;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
    constructor(model: Model) {
        this.model = model;
        this.model.setOnAdd((entity: Entity) => {
            this.onAdd(entity);
        });
        this.model.setOnUpdate((entity: Entity) => {
            this.onUpdate(entity);
        });
        this.model.setOnRemove((entity: Entity) => {
            this.onRemove(entity);
        });
    }

    onAdd(entity: Entity) {
        //console.log('add:' + JSON.stringify(entity));
        // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
        var shape = BABYLON.Mesh.CreateBox(entity.id, 1, this.scene);
        shape.position = entity.interpolatedPosition
        shape.rotationQuaternion = entity.interpolatedRotationQuaternion
    }

    onUpdate(entity: Entity) {
        //console.log('update:' + JSON.stringify(entity));
        var shape = this.scene.getMeshByName(entity.id);
        shape.position = entity.interpolatedPosition
        shape.rotationQuaternion = entity.interpolatedRotationQuaternion
    }

    onRemove(entity: Entity) {
        //console.log('remove:' + JSON.stringify(entity));
        var shape = this.scene.getMeshByName(entity.id);
        this.scene.removeMesh(shape);
    }

    start() {
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
                this.scene.clearColor = new BABYLON.Color3(1, 1, 1);

                // This creates and positions a free camera
                var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

                // This targets the camera to scene origin
                camera.setTarget(BABYLON.Vector3.Zero());

                // This attaches the camera to the canvas
                camera.attachControl(canvas, false);

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
            });

            // Watch for browser/canvas resize events
            window.addEventListener("resize", () => {
                this.engine.resize();
            });
        }
    }
}