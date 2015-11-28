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
                //this.scene.clearColor = new Color3(151/255, 147/255, 198/255);
                this.scene.autoClear = false;

                // This creates and positions a free camera
                //this.camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);

                // This targets the camera to scene origin
                //this.camera.setTarget(Vector3.Zero());

                // This attaches the camera to the canvas
                //this.camera.attachControl(canvas, false);

                this.camera = new TargetCamera("AvatarCamera", new Vector3(0, 5, -10), this.scene);
                this.camera.setTarget(Vector3.Zero());

                // This creates a light, aiming 0,1,0 - to the sky.
                //var light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);
                //light.intensity = .5;

                // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
                //var sphere = Mesh.CreateSphere("sphere1", 16, 2, this.scene);

                // Move the sphere upward 1/2 its height
                //sphere.position.y = 1;

                // Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
                //var ground = Mesh.CreateGround("ground1", 6, 6, 2, this.scene);

                // Leave this function

                // The sky
                /*
                var skybox = BABYLON.Mesh.CreateSphere("skyBox", 10.0, 1000.0, this.scene);
                BABYLON.Effect.ShadersStore.gradientVertexShader = "precision mediump float;attribute vec3 position;attribute vec3 normal;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec4 vPosition;varying vec3 vNormal;void main(){vec4 p = vec4(position,1.);vPosition = p;vNormal = normal;gl_Position = worldViewProjection * p;}";
                BABYLON.Effect.ShadersStore.gradientPixelShader = "precision mediump float;uniform mat4 worldView;varying vec4 vPosition;varying vec3 vNormal;uniform float offset;uniform vec3 topColor;uniform vec3 bottomColor;void main(void){float h = normalize(vPosition+offset).y;gl_FragColor = vec4(mix(bottomColor,topColor,max(pow(max(h,0.0),0.6),0.0)),1.0);}";
                var shader = new BABYLON.ShaderMaterial("gradient", this.scene, "gradient", {});
                shader.setFloat("offset", 10);
                shader.setColor3("topColor", BABYLON.Color3.FromInts(0,119,255));
                shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240,240, 255));
                shader.backFaceCulling = false;
                skybox.material = shader;

                // The terrain
                var groundMaterial = new BABYLON.StandardMaterial("ground", this.scene);
                groundMaterial.diffuseTexture = new BABYLON.Texture("images/height-maps/stewart-island.png", this.scene);
                var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/height-maps/stewart-island.png", 200, 200, 250, 0, 10, this.scene, false);
                ground.material = groundMaterial;
                */

                var material = new BABYLON.StandardMaterial("kosh", this.scene);
                var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 32, 5, this.scene);
                //var sphere2 = BABYLON.Mesh.CreateSphere("Sphere2", 32, 3, this.scene);
                //var sphere3 = BABYLON.Mesh.CreateSphere("Sphere3", 32, 3, this.scene);
                //var sphere4 = BABYLON.Mesh.CreateSphere("Sphere4", 32, 3, this.scene);
                //var sphere5 = BABYLON.Mesh.CreateSphere("Sphere5", 32, 3, this.scene);
                var light = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(-17.6, 18.8, -49.9), this.scene);

                //sphere2.position.z -= 5;
                //sphere3.position.z += 5;
                //sphere4.position.x += 5;
                //sphere5.position.x -= 5;

                // Sphere1 material
                material.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", this.scene);
                material.diffuseColor = new BABYLON.Color3(0, 0, 0);
                material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                material.alpha = 0;
                material.specularPower = 16;

                // Fresnel
                material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
                material.reflectionFresnelParameters.bias = 0.1;

                material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
                material.emissiveFresnelParameters.bias = 0.6;
                material.emissiveFresnelParameters.power = 4;
                material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
                material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();

                material.opacityFresnelParameters = new BABYLON.FresnelParameters();
                material.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
                material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();
                //material.backFaceCulling = false;

                sphere1.material = material;

                /*
                // Sphere2 material
                material = new BABYLON.StandardMaterial("kosh2", this.scene);
                material.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", this.scene);
                material.diffuseColor = new BABYLON.Color3(0, 0, 0);
                material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                material.specularPower = 32;

                // Fresnel
                material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
                material.reflectionFresnelParameters.bias = 0.1;

                material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
                material.emissiveFresnelParameters.bias = 0.5;
                material.emissiveFresnelParameters.power = 4;
                material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
                material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();

                sphere2.material = material;
                sphere2.isBlocker = true; // For intercepting lens flare

                // Sphere3 material
                material = new BABYLON.StandardMaterial("kosh3", this.scene);
                material.diffuseColor = new BABYLON.Color3(0, 0, 0);
                material.emissiveColor = BABYLON.Color3.White();
                material.specularPower = 64;
                material.alpha = 0.2;

                // Fresnel
                material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
                material.emissiveFresnelParameters.bias = 0.2;
                material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
                material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();

                material.opacityFresnelParameters = new BABYLON.FresnelParameters();
                material.opacityFresnelParameters.power = 4;
                material.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
                material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

                sphere3.material = material;
                sphere3.isBlocker = true; // For intercepting lens flare

                // Sphere4 material
                material = new BABYLON.StandardMaterial("kosh4", this.scene);
                material.diffuseColor = new BABYLON.Color3(0, 0, 0);
                material.emissiveColor = BABYLON.Color3.White();
                material.specularPower = 64;

                // Fresnel
                material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
                material.emissiveFresnelParameters.power = 4;
                material.emissiveFresnelParameters.bias = 0.5;
                material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
                material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();

                sphere4.material = material;
                sphere4.isBlocker = true; // For intercepting lens flare

                // Sphere5 material
                material = new BABYLON.StandardMaterial("kosh5", this.scene);
                material.diffuseColor = new BABYLON.Color3(0, 0, 0);
                material.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", this.scene);
                material.reflectionTexture.level = 0.5;
                material.specularPower = 64;
                material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);

                // Fresnel
                material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
                material.emissiveFresnelParameters.bias = 0.4;
                material.emissiveFresnelParameters.power = 2;
                material.emissiveFresnelParameters.leftColor = BABYLON.Color3.Black();
                material.emissiveFresnelParameters.rightColor = BABYLON.Color3.White();

                sphere5.material = material;
                sphere5.isBlocker = true; // For intercepting lens flare
*/
                // Skybox
                var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, this.scene);
                var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
                skyboxMaterial.backFaceCulling = false;
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", this.scene);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.disableLighting = true;
                skybox.material = skyboxMaterial;

                // Lens flares
                var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", light, this.scene);
                var flare00 = new BABYLON.LensFlare(0.2, 0, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
                var flare01 = new BABYLON.LensFlare(0.5, 0.2, new BABYLON.Color3(0.5, 0.5, 1), "images/effects/Flare.png", lensFlareSystem);
                var flare02 = new BABYLON.LensFlare(0.2, 1.0, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
                var flare03 = new BABYLON.LensFlare(0.4, 0.4, new BABYLON.Color3(1, 0.5, 1), "images/effects/Flare.png", lensFlareSystem);
                var flare04 = new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
                var flare05 = new BABYLON.LensFlare(0.3, 0.8, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);

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
                        var cameraDirection = Vector3.TransformCoordinates(new Vector3(0, 2, -10), rotationMatrix)
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