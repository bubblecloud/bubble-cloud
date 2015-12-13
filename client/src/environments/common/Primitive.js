var Mesh = BABYLON.Mesh;
var ClientEntity_1 = require("../../components/ClientEntity");
var Primitive = (function () {
    function Primitive() {
        this.repository = 'default';
        this.environment = 'common';
        this.type = 'primitive';
    }
    Primitive.prototype.construct = function (engine) {
        var newEntity = new ClientEntity_1.PrimitiveEntity();
        newEntity.id = '' + engine.model.idRegister.getNewId();
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
        mesh.material = engine.materialRegister.get("default", "rock");
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
