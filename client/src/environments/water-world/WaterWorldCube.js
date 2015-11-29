var Mesh = BABYLON.Mesh;
var WaterWorldCube = (function () {
    function WaterWorldCube() {
        this.environment = 'water-world';
        this.type = 'water-world-cube';
    }
    WaterWorldCube.prototype.add = function (engine, entity) {
        var scene = engine.renderer.scene;
        Mesh.CreateBox(entity.id, 1, scene);
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
