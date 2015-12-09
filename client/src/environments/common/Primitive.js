var Mesh = BABYLON.Mesh;
var ClientEntity_1 = require("../../components/ClientEntity");
var Primitive = (function () {
    function Primitive() {
        this.repository = 'default';
        this.environment = 'common';
        this.type = 'primitive';
    }
    Primitive.prototype.construct = function () {
        var newEntity = new ClientEntity_1.PrimitiveEntity();
        newEntity.newId();
        newEntity.repo = this.repository;
        newEntity.type = this.type;
        newEntity.dynamic = true;
        newEntity.pType = 'cube';
        return newEntity;
    };
    Primitive.prototype.add = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = Mesh.CreateBox(entity.id, 1, scene);
        mesh.renderingGroupId = 1;
        var material = new BABYLON.StandardMaterial("primitve", scene);
        material.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/evening", scene, ['_px.png', '_py.png', '_pz.png', '_nx.png', '_ny.png', '_nz.png']);
        material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
        material.reflectionFresnelParameters.bias = 0.9;
        material.bumpTexture = new BABYLON.Texture("images/bump-maps/tilesbump.png", scene);
        material.specularColor = new BABYLON.Color3(0.0, 0.0, 0.0);
        material.ambientColor = new BABYLON.Color3(0.6, 0.6, 0.6);
        material.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
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
