import {ContentModule} from "../../components/ContentModule";
import {ClientEngine} from "../../components/ClientEngine";
import {Primitive} from "./Primitive";
import {MaterialRegister} from "../../components/MaterialRegister";
import Material = BABYLON.Material;

export class CommonModule implements ContentModule {

    repository:string = 'default';

    load(engine:ClientEngine): void {
        var scene = engine.renderer.scene;

        var rockMaterial = new BABYLON.StandardMaterial("rock", scene);
        rockMaterial.diffuseTexture = new BABYLON.Texture("images/textures/rock.jpg", scene);
        rockMaterial.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/evening", scene, ['_px.png', '_py.png', '_pz.png', '_nx.png', '_ny.png', '_nz.png']);
        rockMaterial.reflectionFresnelParameters = new BABYLON.FresnelParameters();
        rockMaterial.reflectionFresnelParameters.bias = 0.8;
        rockMaterial.bumpTexture = new BABYLON.Texture("images/bump-maps/rock-bump.jpg", scene);
        rockMaterial.specularColor = new BABYLON.Color3(0.02, 0.02, 0.02);
        rockMaterial.ambientColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        rockMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        engine.materialRegister.add(this.repository, rockMaterial);

        engine.actuatorRegister.add(new Primitive());
    }

    unload(engine:ClientEngine): void {
    }

}