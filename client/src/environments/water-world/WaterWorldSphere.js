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
        scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.4);
        var mesh = Mesh.CreateSphere(entity.id, 100, 1, scene);
        mesh.renderingGroupId = 1;
        var material = new BABYLON.StandardMaterial("sphere", scene);
        material.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        material.ambientColor = new BABYLON.Color3(1, 1, 1);
        material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        mesh.material = material;
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
