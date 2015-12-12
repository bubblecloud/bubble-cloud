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

    construct():ClientEntity {
        var newEntity: PrimitiveEntity = new PrimitiveEntity();
        newEntity.newId();
        newEntity.repo = this.repository;
        newEntity.type = this.type;
        newEntity.dynamic = true;
        return newEntity;
    }

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

        var ni = 20;
        var nj = 20;
        var li = 4;
        var lj = 4;

        var paths = [];
        for (var jj = 0; jj < nj; jj++) {
            var path = [];
            for (var ii = 0; ii < ni; ii++) {
                // Scale i and j to range of 0..1
                var i = ii / ni;
                var j = jj / nj;

                // Define surface function
                var x = li * i;
                var y = lj * j;
                var z = Math.cos(2 * Math.PI * (i-j))/ 5;

                path.push(new BABYLON.Vector3(x, y, z));
            }
            paths.push(path);
        }

        return BABYLON.Mesh.CreateRibbon(name, paths, false, false, 0, scene, false, BABYLON.Mesh.FRONTSIDE);
    }
}