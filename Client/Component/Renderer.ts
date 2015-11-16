/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../../typings/babylonjs/babylonjs.d.ts" />

class Renderer {

    model: Model;
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
        console.log('add:' + JSON.stringify(entity));
    }

    onUpdate(entity: Entity) {
        console.log('update:' + JSON.stringify(entity));
    }

    onRemove(entity: Entity) {
        console.log('remove:' + JSON.stringify(entity));
    }

    start() {
        // Get the canvas element from our HTML above
        var canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("renderCanvas");

        if (!canvas) {
            return;
        }

        if (BABYLON.Engine.isSupported()) {

            // Load the BABYLON 3D engine
            var engine = new BABYLON.Engine(canvas, true);

            // This begins the creation of a function that we will 'call' just after it's built
            var createScene = function () {

                // Now create a basic Babylon Scene object
                var scene = new BABYLON.Scene(engine);

                // Change the scene background color to green.
                scene.clearColor = new BABYLON.Color3(1, 1, 1);

                // This creates and positions a free camera
                var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

                // This targets the camera to scene origin
                camera.setTarget(BABYLON.Vector3.Zero());

                // This attaches the camera to the canvas
                camera.attachControl(canvas, false);

                // This creates a light, aiming 0,1,0 - to the sky.
                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

                // Dim the light a small amount
                light.intensity = .5;

                // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
                var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

                // Move the sphere upward 1/2 its height
                sphere.position.y = 1;

                // Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
                var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

                // Leave this function
                return scene;

            };  // End of createScene function

            // Now, call the createScene function that you just finished creating
            var scene = createScene();

            // Register a render loop to repeatedly render the scene
            engine.runRenderLoop(function () {
                scene.render();
            });

            // Watch for browser/canvas resize events
            window.addEventListener("resize", function () {
                engine.resize();
            });
        }
    }
}