/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../../typings/babylonjs/babylonjs.d.ts" />
var Renderer = (function () {
    function Renderer(model) {
        var _this = this;
        this.model = model;
        this.model.setOnAdd(function (entity) {
            _this.onAdd(entity);
        });
        this.model.setOnUpdate(function (entity) {
            _this.onUpdate(entity);
        });
        this.model.setOnRemove(function (entity) {
            _this.onRemove(entity);
        });
    }
    Renderer.prototype.onAdd = function (entity) {
        var shape = BABYLON.Mesh.CreateBox(entity.id, 1, this.scene);
        shape.position.x = entity.interpolatedPosition.x;
        shape.position.y = entity.interpolatedPosition.y;
        shape.position.z = entity.interpolatedPosition.z;
        shape.rotationQuaternion = new BABYLON.Quaternion();
        shape.rotationQuaternion.x = entity.rotationQuaternion.x;
        shape.rotationQuaternion.y = entity.rotationQuaternion.y;
        shape.rotationQuaternion.z = entity.rotationQuaternion.z;
        shape.rotationQuaternion.w = entity.rotationQuaternion.w;
    };
    Renderer.prototype.onUpdate = function (entity) {
        var shape = this.scene.getMeshByName(entity.id);
        shape.position.x = entity.interpolatedPosition.x;
        shape.position.y = entity.interpolatedPosition.y;
        shape.position.z = entity.interpolatedPosition.z;
        shape.rotationQuaternion.x = entity.rotationQuaternion.x;
        shape.rotationQuaternion.y = entity.rotationQuaternion.y;
        shape.rotationQuaternion.z = entity.rotationQuaternion.z;
        shape.rotationQuaternion.w = entity.rotationQuaternion.w;
    };
    Renderer.prototype.onRemove = function (entity) {
        var shape = this.scene.getMeshByName(entity.id);
        this.scene.removeMesh(shape);
    };
    Renderer.prototype.start = function () {
        var _this = this;
        var canvas = document.getElementById("renderCanvas");
        if (!canvas) {
            return;
        }
        if (BABYLON.Engine.isSupported()) {
            this.engine = new BABYLON.Engine(canvas, true);
            var createScene = function () {
                _this.scene = new BABYLON.Scene(_this.engine);
                _this.scene.clearColor = new BABYLON.Color3(1, 1, 1);
                var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), _this.scene);
                camera.setTarget(BABYLON.Vector3.Zero());
                camera.attachControl(canvas, false);
                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), _this.scene);
                light.intensity = .5;
                return _this.scene;
            };
            this.scene = createScene();
            this.engine.runRenderLoop(function () {
                _this.model.interpolate();
                _this.scene.render();
            });
            window.addEventListener("resize", function () {
                _this.engine.resize();
            });
        }
    };
    return Renderer;
})();
