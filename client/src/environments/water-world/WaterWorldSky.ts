import {ClientEntity} from "../../components/ClientEntity";
import Mesh = BABYLON.Mesh;
import Scene = BABYLON.Scene;
import {ClientEngine} from "../../components/ClientEngine";
import {Actuator} from "../../components/Actuator";

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
        //scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR
        //scene.fogDensity = 0.01;
        //scene.fogStart = 20.0;
        //scene.fogEnd = 60.0;

        // Add sky.
        var skybox = BABYLON.Mesh.CreateBox(entity.id, 10000, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial(entity.id + "skybox-material", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.renderingGroupId = 0;
        skybox.material = skyboxMaterial;

        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light1.diffuse = new BABYLON.Color3(1, 1, 1);
        light1.specular = new BABYLON.Color3(0, 0, 0);
        light1.groundColor = new BABYLON.Color3(0, 0, 0);
        light1.parent = skybox;

        // Add sun.
        var light = new BABYLON.PointLight("sun" + entity.id, new BABYLON.Vector3(-17.6, 18.8, -49.9), scene);
        //light.position = new BABYLON.Vector3(-17.6, 18.8, -49.9);
        //light.setDirectionToTarget(new BABYLON.Vector3(-17.6, 18.8, -49.9).scale(-1))
        light.parent = skybox;

        var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", light, scene);
        new BABYLON.LensFlare(0.2, 0, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.5, 0.2, new BABYLON.Color3(0.5, 0.5, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.2, 1.0, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.4, 0.4, new BABYLON.Color3(1, 0.5, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.3, 0.8, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);

        engine.renderer.avatarAttachments.push(entity);

        var waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
        waterMaterial.bumpTexture = new BABYLON.Texture("images/bump-maps/waterbump.png", scene);
        waterMaterial.windForce = -0.5;
        waterMaterial.waveHeight = 0.0;
        waterMaterial.bumpHeight = 0.05;
        waterMaterial.waveLength = 0.1;
        waterMaterial.waveSpeed = 0.1;
        waterMaterial.colorBlendFactor = 0;
        waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
        waterMaterial.colorBlendFactor = 0;

        // Water mesh
        var waterMesh = BABYLON.Mesh.CreateGround("water" + entity.id, 5000, 5000, 32, scene, false);
        waterMesh.parent = skybox;
        waterMesh.position.y = - 100;
        waterMesh.renderingGroupId = 0;
        waterMesh.material = waterMaterial;

        waterMaterial.addToRenderList(skybox);
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