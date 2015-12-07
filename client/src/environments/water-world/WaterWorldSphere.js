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
        var mesh = Mesh.CreateSphere(entity.id, 32, 1, scene);
        var material = new BABYLON.StandardMaterial("kosh", scene);
        material.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", scene);
        material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        material.specularPower = 16;
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
