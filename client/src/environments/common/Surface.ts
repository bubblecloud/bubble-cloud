import {Actuator} from "../../components/Actuator";
import {ClientEngine} from "../../components/ClientEngine";
import {ClientEntity} from "../../components/ClientEntity";
import Mesh = BABYLON.Mesh;
import Scene = BABYLON.Scene;
import {PrimitiveEntity} from "../../components/ClientEntity";
import AbstractMesh = BABYLON.AbstractMesh;
export class Surface implements Actuator {
    repository: string = 'default';
    environment: string = 'common';
    type: string = 'surface';

    add(engine: ClientEngine, entity: ClientEntity): void {
        var scene: Scene = engine.renderer.scene;
        var mesh = this.createSurface(entity.id, scene);
        mesh.renderingGroupId = 1;
        mesh.material = engine.materialRegister.get("default", "rock");
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

    createSurface(name: string, scene: Scene): AbstractMesh {

        var ni = 10;
        var nj = 10;
        var li = 2;
        var lj = 2;

        var paths = [];
        for (var j = 0; j < nj; j++) {
            var path = [];
            for (var i = 0; i < ni; i++) {
                path.push(new BABYLON.Vector3(li * i / ni - li / 2, lj * j / nj - lj / 2, 0));
            }
            paths[j] = path;
        }

        return BABYLON.Mesh.CreateRibbon(name, paths, false, false, 0, scene, false, BABYLON.Mesh.FRONTSIDE);
    }
}