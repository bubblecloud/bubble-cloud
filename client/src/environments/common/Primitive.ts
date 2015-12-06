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

        var material = new BABYLON.StandardMaterial("kosh", scene);
        material.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", scene);
        material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        material.alpha = 0.2;
        material.specularPower = 16;
        material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
        material.reflectionFresnelParameters.bias = 0.1;
        material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
        material.emissiveFresnelParameters.bias = 0.6;
        material.emissiveFresnelParameters.power = 4;
        material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
        material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();
        material.opacityFresnelParameters = new BABYLON.FresnelParameters();
        material.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
        material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();
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