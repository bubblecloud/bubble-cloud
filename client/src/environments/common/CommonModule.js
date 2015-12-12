var Primitive_1 = require("./Primitive");
var Surface_1 = require("./Surface");
var CommonModule = (function () {
    function CommonModule() {
        this.repository = 'default';
    }
    CommonModule.prototype.load = function (engine) {
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
        engine.actuatorRegister.add(new Primitive_1.Primitive());
        engine.actuatorRegister.add(new Surface_1.Surface());
    };
    CommonModule.prototype.unload = function (engine) {
    };
    return CommonModule;
})();
exports.CommonModule = CommonModule;
