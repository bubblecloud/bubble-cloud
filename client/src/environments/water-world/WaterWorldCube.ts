import {Actuator} from "../../components/Actuator";
import {ClientEngine} from "../../components/ClientEngine";
import {ClientEntity} from "../../components/ClientEntity";
import Mesh = BABYLON.Mesh;
import Scene = BABYLON.Scene;
export class WaterWorldCube implements Actuator {
    environment: string = 'water-world';
    type: string = 'water-world-cube';

    add(engine: ClientEngine, entity: ClientEntity): void {
        var scene: Scene = engine.renderer.scene;
        Mesh.CreateBox(entity.id, 1, scene);
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