var Mesh = BABYLON.Mesh;
var WaterWorldCube = (function () {
    function WaterWorldCube() {
        this.repository = 'default';
        this.environment = 'water-world';
        this.type = 'water-world-cube';
    }
    WaterWorldCube.prototype.construct = function () {
        return undefined;
    };
    WaterWorldCube.prototype.add = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = Mesh.CreateBox(entity.id, 1, scene);
        mesh.renderingGroupId = 1;
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
    };
    WaterWorldCube.prototype.remove = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = scene.getMeshByName(entity.id);
        if (mesh) {
            scene.removeMesh(mesh);
        }
    };
    WaterWorldCube.prototype.update = function (engine, entity) {
    };
    return WaterWorldCube;
})();
exports.WaterWorldCube = WaterWorldCube;
