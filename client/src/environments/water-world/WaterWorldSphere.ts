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
        var mesh = Mesh.CreateSphere(entity.id, 30, 1, scene);
        mesh.renderingGroupId = 1;

        var material = new BABYLON.StandardMaterial("sphere", scene);
        material.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        material.ambientColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
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