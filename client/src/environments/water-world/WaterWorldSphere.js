var Mesh = BABYLON.Mesh;
var WaterWorldSphere = (function () {
    function WaterWorldSphere() {
        this.repository = 'default';
        this.environment = 'water-world';
        this.type = 'water-world-sphere';
    }
    WaterWorldSphere.prototype.construct = function () {
        return undefined;
    };
    WaterWorldSphere.prototype.add = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = Mesh.CreateSphere(entity.id, 30, 1, scene);
        mesh.renderingGroupId = 1;
        mesh.material = engine.materialRegister.get("default", "rock");
    };
    WaterWorldSphere.prototype.remove = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = scene.getMeshByName(entity.id);
        if (mesh) {
            scene.removeMesh(mesh);
        }
    };
    WaterWorldSphere.prototype.update = function (engine, entity) {
    };
    return WaterWorldSphere;
})();
exports.WaterWorldSphere = WaterWorldSphere;
