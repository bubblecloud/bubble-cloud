var ClientEntity_1 = require("../../components/ClientEntity");
var math = require('mathjs');
var Surface = (function () {
    function Surface() {
        this.repository = 'default';
        this.environment = 'common';
        this.type = 'surface';
    }
    Surface.prototype.construct = function () {
        var newEntity = new ClientEntity_1.SurfaceEntity();
        newEntity.newId();
        newEntity.repo = this.repository;
        newEntity.type = this.type;
        newEntity.dynamic = true;
        newEntity.ni = 20;
        newEntity.nj = 20;
        newEntity.w = 4;
        newEntity.h = 4;
        newEntity.d = 4;
        newEntity.fx = 'w * i';
        newEntity.fy = 'h * j';
        newEntity.fz = 'cos(2 * PI * (i-j)) / d';
        return newEntity;
    };
    Surface.prototype.add = function (engine, entity) {
        var scene = engine.renderer.scene;
        var surface = entity;
        var ni = surface.ni;
        var nj = surface.nj;
        var w = surface.w;
        var h = surface.h;
        var d = surface.d;
        var fx = surface.fx;
        var fy = surface.fy;
        var fz = surface.fz;
        var mesh = this.createSurface(entity.id, scene, ni, nj, w, h, d, fx, fy, fz);
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
    Surface.prototype.createSurface = function (name, scene, ni, nj, w, h, d, fx, fy, fz) {
        var paths = [];
        for (var jj = 0; jj < nj; jj++) {
            var path = [];
            for (var ii = 0; ii < ni; ii++) {
                var i = ii / ni;
                var j = jj / nj;
                var scope = { 'i': i, 'j': j, 'w': w, 'h': h, 'd': d };
                var x = math.eval(fx, scope);
                var y = math.eval(fy, scope);
                var z = math.eval(fz, scope);
                path.push(new BABYLON.Vector3(x, y, z));
            }
            paths.push(path);
        }
        return BABYLON.Mesh.CreateRibbon(name, paths, false, false, 0, scene, false, BABYLON.Mesh.DOUBLESIDE);
    };
    return Surface;
})();
exports.Surface = Surface;
