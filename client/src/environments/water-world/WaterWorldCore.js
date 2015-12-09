var WaterWorldCore = (function () {
    function WaterWorldCore() {
        this.repository = 'default';
        this.environment = 'water-world';
        this.type = 'water-world-core';
    }
    WaterWorldCore.prototype.construct = function () {
        return undefined;
    };
    WaterWorldCore.prototype.add = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = BABYLON.Mesh.CreateSphere(entity.id, 32, 1, scene);
        mesh.renderingGroupId = 1;
        var material = new BABYLON.StandardMaterial("kosh", scene);
        material.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/evening", scene, ['_px.png', '_py.png', '_pz.png', '_nx.png', '_ny.png', '_nz.png']);
        material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        material.alpha = 0;
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
    };
    WaterWorldCore.prototype.remove = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = scene.getMeshByName(entity.id);
        if (mesh) {
            scene.removeMesh(mesh);
        }
    };
    WaterWorldCore.prototype.update = function (engine, entity) {
    };
    return WaterWorldCore;
})();
exports.WaterWorldCore = WaterWorldCore;
