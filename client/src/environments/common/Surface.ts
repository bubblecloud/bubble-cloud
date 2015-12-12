import {Actuator} from "../../components/Actuator";
import {ClientEngine} from "../../components/ClientEngine";
import {ClientEntity} from "../../components/ClientEntity";
import Mesh = BABYLON.Mesh;
import Scene = BABYLON.Scene;
import {PrimitiveEntity} from "../../components/ClientEntity";
import AbstractMesh = BABYLON.AbstractMesh;
import {SurfaceEntity} from "../../components/ClientEntity";

var math = require('mathjs');

export class Surface implements Actuator {
    repository: string = 'default';
    environment: string = 'common';
    type: string = 'surface';

    construct():ClientEntity {
        var newEntity: SurfaceEntity = new SurfaceEntity();
        newEntity.newId();
        newEntity.repo = this.repository;
        newEntity.type = this.type;
        newEntity.dynamic = true;

        newEntity.ni = 20;
        newEntity.nj = 20;

        newEntity.w = 4;
        newEntity.h = 4;
        newEntity.d = 4;

        newEntity.fx = 'w * i';
        newEntity.fy = 'h * j';
        newEntity.fz = 'cos(2 * PI * (i-j)) / d';

        return newEntity;
    }

    add(engine: ClientEngine, entity: ClientEntity): void {
        var scene: Scene = engine.renderer.scene;

        var surface: SurfaceEntity = <SurfaceEntity> entity;
        var ni = surface.ni;
        var nj = surface.nj;

        var w = surface.w;
        var h = surface.h;
        var d = surface.d;

        var fx = surface.fx;
        var fy = surface.fy;
        var fz = surface.fz;

        var mesh = this.createSurface(entity.id, scene, ni, nj, w, h, d, fx, fy, fz);
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

    createSurface(name: string, scene: Scene, ni: number, nj: number, w: number, h: number, d: number, fx: string, fy: string, fz: string): AbstractMesh {

        var paths = [];
        for (var jj = 0; jj < nj; jj++) {
            var path = [];
            for (var ii = 0; ii < ni; ii++) {
                // Scale i and j to range of 0..1
                var i = ii / ni;
                var j = jj / nj;

                // Define scope
                var scope = {'i':i, 'j':j, 'w': w, 'h': h, 'd': d};

                // Define surface function
                var x = math.eval(fx, scope);
                var y = math.eval(fy, scope);
                var z = math.eval(fz, scope);

                /*var z = Math.cos(2 * Math.PI * (i-j))/ 5;*/

                path.push(new BABYLON.Vector3(x, y, z));
            }
            paths.push(path);
        }

        return BABYLON.Mesh.CreateRibbon(name, paths, false, false, 0, scene, false, BABYLON.Mesh.DOUBLESIDE);
    }
}