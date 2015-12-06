var ClientEntity_1 = require("../../components/ClientEntity");
var Mesh = BABYLON.Mesh;
var Primitive = (function () {
    function Primitive() {
        this.repository = 'default';
        this.environment = 'common';
        this.type = 'primitive';
    }
    Primitive.prototype.construct = function () {
        var newEntity = new ClientEntity_1.ClientEntity();
        newEntity.newId();
        newEntity.repo = this.repository;
        newEntity.type = this.environment;
        newEntity.dynamic = true;
        return newEntity;
    };
    Primitive.prototype.add = function (engine, entity) {
        var scene = engine.renderer.scene;
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
    };
    Primitive.prototype.remove = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = scene.getMeshByName(entity.id);
        if (mesh) {
            scene.removeMesh(mesh);
        }
    };
    Primitive.prototype.update = function (engine, entity) {
    };
    return Primitive;
})();
exports.Primitive = Primitive;
