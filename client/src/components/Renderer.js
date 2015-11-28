var Engine = BABYLON.Engine;
var Scene = BABYLON.Scene;
var TargetCamera = BABYLON.TargetCamera;
var Mesh = BABYLON.Mesh;
var Vector3 = BABYLON.Vector3;
var Matrix = BABYLON.Matrix;
var Renderer = (function () {
    function Renderer(clientEngine, model, keyboardInputController) {
        var _this = this;
        this.lastLoopTimeMillis = new Date().getTime();
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
        var shape = Mesh.CreateBox(entity.id, 1, this.scene);
        shape.position = entity.interpolatedPosition;
        shape.rotationQuaternion = entity.interpolatedRotationQuaternion;
        if (entity.oid == this.clientEngine.avatarController.avatar.id) {
            this.avatarShape = Mesh.CreateBox(entity.id, 1, this.scene);
            shape.visibility = 0;
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
        if (Engine.isSupported()) {
            this.engine = new Engine(canvas, true);
            var createScene = function () {
                _this.scene = new Scene(_this.engine);
                _this.scene.autoClear = false;
                _this.camera = new TargetCamera("AvatarCamera", new Vector3(0, 5, -10), _this.scene);
                _this.camera.setTarget(Vector3.Zero());
                var material = new BABYLON.StandardMaterial("kosh", _this.scene);
                var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 32, 5, _this.scene);
                var light = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(-17.6, 18.8, -49.9), _this.scene);
                material.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", _this.scene);
                material.diffuseColor = new BABYLON.Color3(0, 0, 0);
                material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                material.alpha = 0;
                material.specularPower = 16;
                material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
                material.reflectionFresnelParameters.bias = 0.1;
                material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
                material.emissiveFresnelParameters.bias = 0.6;
                material.emissiveFresnelParameters.power = 4;
                material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
                material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();
                material.opacityFresnelParameters = new BABYLON.FresnelParameters();
                material.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
                material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();
                sphere1.material = material;
                var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, _this.scene);
                var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", _this.scene);
                skyboxMaterial.backFaceCulling = false;
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", _this.scene);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.disableLighting = true;
                skybox.material = skyboxMaterial;
                var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", light, _this.scene);
                var flare00 = new BABYLON.LensFlare(0.2, 0, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
                var flare01 = new BABYLON.LensFlare(0.5, 0.2, new BABYLON.Color3(0.5, 0.5, 1), "images/effects/Flare.png", lensFlareSystem);
                var flare02 = new BABYLON.LensFlare(0.2, 1.0, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
                var flare03 = new BABYLON.LensFlare(0.4, 0.4, new BABYLON.Color3(1, 0.5, 1), "images/effects/Flare.png", lensFlareSystem);
                var flare04 = new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
                var flare05 = new BABYLON.LensFlare(0.3, 0.8, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
                return _this.scene;
            };
            this.scene = createScene();
            this.engine.runRenderLoop(function () {
                _this.model.interpolate();
                _this.scene.render();
                var timeMillis = (new Date).getTime();
                var timeDeltaMillis = timeMillis - _this.lastLoopTimeMillis;
                if (_this.clientEngine.running) {
                    _this.clientEngine.avatarController.renderLoop(timeMillis, timeDeltaMillis);
                    if (_this.avatarShape) {
                        _this.avatarShape.position = _this.clientEngine.avatarController.avatar.position;
                        _this.avatarShape.rotationQuaternion = _this.clientEngine.avatarController.avatar.rotationQuaternion;
                        var rotationMatrix = new Matrix();
                        _this.avatarShape.rotationQuaternion.toRotationMatrix(rotationMatrix);
                        var cameraDirection = Vector3.TransformCoordinates(new Vector3(0, 2, -10), rotationMatrix);
                        _this.camera.position = cameraDirection.add(_this.avatarShape.position);
                        _this.camera.setTarget(_this.avatarShape.position);
                    }
                }
                _this.lastLoopTimeMillis = timeMillis;
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
exports.Renderer = Renderer;
