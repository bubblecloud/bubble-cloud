import {Actuator} from "../../components/Actuator";
import {ClientEngine} from "../../components/ClientEngine";
import {ClientEntity} from "../../components/ClientEntity";
import Mesh = BABYLON.Mesh;
import Scene = BABYLON.Scene;
export class WaterWorldSphere implements Actuator {
    repository: string = 'default';
    environment: string = 'water-world';
    type: string = 'water-world-sphere';

    construct():ClientEntity {
        return undefined;
    }

    add(engine: ClientEngine, entity: ClientEntity): void {
        var scene: Scene = engine.renderer.scene;
        scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.4);
        var mesh = Mesh.CreateSphere(entity.id, 100, 1, scene);
        mesh.renderingGroupId = 1;

        var material = new BABYLON.StandardMaterial("sphere", scene);
        //material.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", scene);
        material.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        material.ambientColor = new BABYLON.Color3(1, 1, 1);
        material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        //material.specularPower = 16;
        mesh.material = material;
    }
    remove(engine: ClientEngine, entity: ClientEntity): void {
        var scene: Scene = engine.renderer.scene;
        var mesh = scene.getMeshByName(entity.id);
        if (mesh) {
            scene.removeMesh(mesh);
        }
    }
    update(engine: ClientEngine, entity: ClientEntity): void {

    }
}