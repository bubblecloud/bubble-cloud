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
        var mesh = Mesh.CreateSphere(entity.id, 32, 1, scene);

        var material = new BABYLON.StandardMaterial("kosh", scene);
        material.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", scene);
        material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        //material.emissiveColor = new BABYLON.Color3(0.9, 0.9, 0.9);
       //material.alpha = 0.8;
        material.specularPower = 16;
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