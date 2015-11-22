/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/es6-promise/es6-promise.d.ts" />
/// <reference path="../../typings/babylonjs/babylonjs.d.ts" />
var Renderer = (function () {
    function Renderer(clientEngine, model, keyboardInputController) {
        var _this = this;
        this.clientEngine = clientEngine;
        this.model = model;
        this.keyboardReader = keyboardInputController;
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
        shape.position = entity.interpolatedPosition;
        shape.rotationQuaternion = entity.interpolatedRotationQuaternion;
        if (entity.oid == this.clientEngine.avatarController.avatar.id) {
            this.camera.target = shape;
        }
    };
    Renderer.prototype.onUpdate = function (entity) {
        var shape = this.scene.getMeshByName(entity.id);
        shape.position = entity.interpolatedPosition;
        shape.rotationQuaternion = entity.interpolatedRotationQuaternion;
    };
    Renderer.prototype.onRemove = function (entity) {
        var shape = this.scene.getMeshByName(entity.id);
        this.scene.removeMesh(shape);
    };
    Renderer.prototype.startup = function () {
        var _this = this;
        var canvas = document.getElementById("renderCanvas");
        if (!canvas) {
            return;
        }
        if (BABYLON.Engine.isSupported()) {
            this.engine = new BABYLON.Engine(canvas, true);
            var createScene = function () {
                _this.scene = new BABYLON.Scene(_this.engine);
                _this.scene.clearColor = new BABYLON.Color3(151 / 255, 147 / 255, 198 / 255);
                _this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), _this.scene);
                _this.camera.heightOffset = 5;
                _this.camera.radius = 10;
                _this.camera.rotationOffset = 180;
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
    Renderer.prototype.shutdown = function () {
        this.engine.stopRenderLoop();
    };
    return Renderer;
})();
