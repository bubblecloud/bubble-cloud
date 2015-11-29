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
import {Actuator} from "./Actuator";
import AbstractMesh = BABYLON.AbstractMesh;

export class Renderer {

    model: ClientModel;
    keyboardReader: KeyboardReader;

    clientEngine: ClientEngine;
    engine: Engine;
    scene: Scene;
    camera: TargetCamera;
    avatarShape: AbstractMesh;

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
        var actuator: Actuator = this.clientEngine.actuatorRegister.get(entity.repo, entity.type);

        if (actuator) {
            actuator.add(this.clientEngine, entity);
            console.log("entity: " + entity.id + " - Added entity type " + entity.repo + "/" + entity.type);
        } else {
            var newShape = Mesh.CreateBox(entity.id, 1, this.scene);
            newShape.position = entity.interpolatedPosition;
            newShape.rotationQuaternion = entity.interpolatedRotationQuaternion;
            console.log("entity: " + entity.id + " - Unknown entity type " + entity.repo + "/" + entity.type);
        }

        var shape = this.scene.getMeshByName(entity.id);
        if (entity.oid == this.clientEngine.avatarController.avatar.id) {
            this.avatarShape = shape; // Mesh.CreateBox(entity.id, 1, this.scene);
            //shape.visibility = 0;
        }
    }

    onUpdate(entity: ClientEntity) {
        // Update others than avatar which is locally controlled in render loop to eliminate lag
        if (entity.oid == this.clientEngine.avatarController.avatar.id) {
            return;
        }

        var shape = this.scene.getMeshByName(entity.id);
        if (!shape) {
            console.log("entity: " + entity.id + " - Updated entity not added yet: " + entity.repo + "/" + entity.type);
            return;
        }

        shape.position = entity.interpolatedPosition;
        shape.rotationQuaternion = entity.interpolatedRotationQuaternion;

        var actuator:Actuator = this.clientEngine.actuatorRegister.get(entity.repo, entity.type);
        if (actuator) {
            actuator.update(this.clientEngine, entity);
        }
    }

    onRemove(entity: ClientEntity) {
        var actuator:Actuator = this.clientEngine.actuatorRegister.get(entity.repo, entity.type);
        if (actuator) {
            actuator.remove(this.clientEngine, entity);
            console.log("entity: " + entity.id + " - Removed entity type " + entity.repo + "/" + entity.type);
        } else {
            var shape = this.scene.getMeshByName(entity.id);
            if (shape) {
                this.scene.removeMesh(shape);
            }
        }
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
                this.scene = new Scene(this.engine);
                this.scene.autoClear = false;

                this.camera = new TargetCamera("AvatarCamera", new Vector3(0, 5, -10), this.scene);
                this.camera.setTarget(Vector3.Zero());

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