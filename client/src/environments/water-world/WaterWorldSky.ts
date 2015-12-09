import {ClientEntity} from "../../components/ClientEntity";
import Mesh = BABYLON.Mesh;
import Scene = BABYLON.Scene;
import {ClientEngine} from "../../components/ClientEngine";
import {Actuator} from "../../components/Actuator";
import Quaternion = BABYLON.Quaternion;
import Matrix = BABYLON.Matrix;

/**
 * The water world sky.
 */
export class WaterWorldSky implements Actuator {
    repository: string = 'default';
    environment: string = "water-world";
    type: string = "water-world-sky";

    construct():ClientEntity {
        return undefined;
    }

    add(engine: ClientEngine, entity: ClientEntity): void {
        // Do not render sky of other servers.
        if (entity.external) {
            return;
        }
        var scene: Scene = engine.renderer.scene;

        scene.ambientColor = BABYLON.Color3.FromInts(0,80,215);

        var skySphere = BABYLON.Mesh.CreateSphere(entity.id, 100.0, 10000.0, scene);
        BABYLON.Effect.ShadersStore['gradientVertexShader'] = "precision mediump float;attribute vec3 position;attribute vec3 normal;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec4 vPosition;varying vec3 vNormal;void main(){vec4 p = vec4(position,1.);vPosition = p;vNormal = normal;gl_Position = worldViewProjection * p;}";
        BABYLON.Effect.ShadersStore['gradientPixelShader'] = "precision mediump float;uniform mat4 worldView;varying vec4 vPosition;varying vec3 vNormal;uniform float offset;uniform vec3 topColor;uniform vec3 bottomColor;void main(void){float h = normalize(vPosition+offset).y;gl_FragColor = vec4( mix(bottomColor, topColor, max(pow(max(h, 0.0), 1.2), 0.0)), 1.0 );}";
        var shader = new BABYLON.ShaderMaterial("gradient", scene, "gradient", {});
        shader.setFloat("offset", 10);
        shader.setColor3("topColor", BABYLON.Color3.FromInts(229,229,190));
        shader.setColor3("bottomColor", BABYLON.Color3.FromInts(0,57,115));
        shader.backFaceCulling = false;
        skySphere.material = shader;

        var light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, -10, 0), scene);
        light1.diffuse = BABYLON.Color3.FromInts(229,229,190);
        light1.specular =  BABYLON.Color3.FromInts(0, 0, 0);
       //light1.groundColor = new BABYLON.Color3(0, 0, 0);
        light1.parent = skySphere;

        // Add sun.
        var light = new BABYLON.PointLight("sun" + entity.id, new BABYLON.Vector3(-30, 50, -30), scene);
        //light.position = new BABYLON.Vector3(-17.6, 18.8, -49.9);
        //light.setDirectionToTarget(new BABYLON.Vector3(-17.6, 18.8, -49.9).scale(-1))
        light.parent = skySphere;

        /*var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", light, scene);
        new BABYLON.LensFlare(0.2, 0, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.5, 0.2, new BABYLON.Color3(0.5, 0.5, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.2, 1.0, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.4, 0.4, new BABYLON.Color3(1, 0.5, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.3, 0.8, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);*/

        engine.renderer.avatarAttachments.push(entity);

        var waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
        waterMaterial.bumpTexture = new BABYLON.Texture("images/bump-maps/waterbump.png", scene);
        waterMaterial.zOffset = -1;
        waterMaterial.windForce = -1;
        waterMaterial.waveHeight = 0.0;
        waterMaterial.bumpHeight = 0.1;
        waterMaterial.waveLength = 0.2;
        waterMaterial.waveSpeed = 50;
        waterMaterial.colorBlendFactor = 0.01;
        waterMaterial.windDirection = new BABYLON.Vector2(1, 1);

        /*
        var groundTexture = new BABYLON.Texture("images/textures/sand.jpg", scene);
        groundTexture.vScale = groundTexture.uScale = 20;

        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = groundTexture;

        var ground = BABYLON.Mesh.CreateGround("ground", 512, 512, 32, scene, false);
        ground.parent = skySphere;
        ground.position.y = -21;
        ground.renderingGroupId = 0;
        ground.material = groundMaterial;*/

        // Water mesh
        var waterMesh = BABYLON.Mesh.CreateGround("water" + entity.id, 10000, 10000, 32, scene, false);
        //waterMesh.parent = skySphere;
        waterMesh.position.y = -100;
        waterMesh.renderingGroupId = 0;
        waterMesh.material = waterMaterial;
        //waterMesh.

        //waterMaterial.addToRenderList(ground);
        waterMaterial.addToRenderList(skySphere);

        //engine.renderer.avatarAttachments.push(skySphere);
    }

    remove(engine: ClientEngine, entity: ClientEntity): void {
        var scene: Scene = engine.renderer.scene;
        var mesh = scene.getMeshByName(entity.id);
        if (mesh) {
            scene.removeLight(scene.getLightByName("sun" + entity.id));
            scene.removeMesh(scene.getMeshByName("water" + entity.id));
            scene.removeMesh(mesh);
        }
        if (engine.renderer.avatarAttachments.indexOf(entity) >= 0) {
            engine.renderer.avatarAttachments.splice(engine.renderer.avatarAttachments.indexOf(entity), 1);
        }
    }

    update(engine: ClientEngine, entity: ClientEntity): void {
        // TODO update location according to sky location
        var scene: Scene = engine.renderer.scene;
        var mesh = scene.getMeshByName(entity.id);
        if (mesh) {
            mesh.position = engine.avatarController.avatar.position;
        }
    }

}