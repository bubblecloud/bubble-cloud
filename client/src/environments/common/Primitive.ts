import {Actuator} from "../../components/Actuator";
import {ClientEngine} from "../../components/ClientEngine";
import {ClientEntity} from "../../components/ClientEntity";
import Mesh = BABYLON.Mesh;
import Scene = BABYLON.Scene;
import {PrimitiveEntity} from "../../components/ClientEntity";
export class Primitive implements Actuator {
    repository: string = 'default';
    environment: string = 'common';
    type: string = 'primitive';

    construct():ClientEntity {
        var newEntity: PrimitiveEntity = new PrimitiveEntity();
        newEntity.newId();
        newEntity.repo = this.repository;
        newEntity.type = this.type;
        newEntity.dynamic = true;
        newEntity.pType = 'cube';
        return newEntity;
    }

    add(engine: ClientEngine, entity: ClientEntity): void {
        var scene: Scene = engine.renderer.scene;
        var mesh = Mesh.CreateBox(entity.id, 1, scene);
        mesh.renderingGroupId = 1;
        var material = new BABYLON.StandardMaterial("primitve", scene);
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