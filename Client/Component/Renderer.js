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
        console.log('add:' + JSON.stringify(entity));
    };
    Renderer.prototype.onUpdate = function (entity) {
        console.log('update:' + JSON.stringify(entity));
    };
    Renderer.prototype.onRemove = function (entity) {
        console.log('remove:' + JSON.stringify(entity));
    };
    Renderer.prototype.start = function () {
        var canvas = document.getElementById("renderCanvas");
        if (!canvas) {
            return;
        }
        if (BABYLON.Engine.isSupported()) {
            var engine = new BABYLON.Engine(canvas, true);
            var createScene = function () {
                var scene = new BABYLON.Scene(engine);
                scene.clearColor = new BABYLON.Color3(1, 1, 1);
                var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
                camera.setTarget(BABYLON.Vector3.Zero());
                camera.attachControl(canvas, false);
                var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
                light.intensity = .5;
                var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
                sphere.position.y = 1;
                var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
                return scene;
            };
            var scene = createScene();
            engine.runRenderLoop(function () {
                scene.render();
            });
            window.addEventListener("resize", function () {
                engine.resize();
            });
        }
    };
    return Renderer;
})();
