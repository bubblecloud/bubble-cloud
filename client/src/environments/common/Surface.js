var Surface = (function () {
    function Surface() {
        this.repository = 'default';
        this.environment = 'common';
        this.type = 'surface';
    }
    Surface.prototype.add = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = this.createSurface(entity.id, scene);
        mesh.renderingGroupId = 1;
        mesh.material = engine.materialRegister.get("default", "rock");
    };
    Surface.prototype.remove = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = scene.getMeshByName(entity.id);
        if (mesh) {
            scene.removeMesh(mesh);
        }
    };
    Surface.prototype.update = function (engine, entity) {
    };
    Surface.prototype.createSurface = function (name, scene) {
        var ni = 10;
        var nj = 10;
        var li = 2;
        var lj = 2;
        var paths = [];
        for (var j = 0; j < nj; j++) {
            var path = [];
            for (var i = 0; i < ni; i++) {
                path.push(new BABYLON.Vector3(li * i / ni - li / 2, lj * j / nj - lj / 2, 0));
            }
            paths[j] = path;
        }
        return BABYLON.Mesh.CreateRibbon(name, paths, false, false, 0, scene, false, BABYLON.Mesh.FRONTSIDE);
    };
    return Surface;
})();
exports.Surface = Surface;
