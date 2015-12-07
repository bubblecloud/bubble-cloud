var Engine = BABYLON.Engine;
var Scene = BABYLON.Scene;
var TargetCamera = BABYLON.TargetCamera;
var Mesh = BABYLON.Mesh;
var Vector3 = BABYLON.Vector3;
var Matrix = BABYLON.Matrix;
var Renderer = (function () {
    function Renderer(clientEngine, model, keyboardInputController) {
        var _this = this;
        this.avatarAttachments = [];
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
        var actuator = this.clientEngine.actuatorRegister.get(entity.repo, entity.type);
        if (actuator) {
            actuator.add(this.clientEngine, entity);
            console.log("entity: " + entity.id + " (" + entity.oid + ") - Added entity type " + entity.repo + " / " + entity.type + " dyn: " + entity.dynamic + " ext: " + entity.external);
        }
        else {
            var newShape = Mesh.CreateBox(entity.id, 1, this.scene);
            newShape.position = entity.interpolatedPosition;
            newShape.rotationQuaternion = entity.interpolatedRotationQuaternion;
            console.log("entity: " + entity.id + " (" + entity.oid + ") - Unknown entity type " + entity.repo + " / " + entity.type);
        }
        var shape = this.scene.getMeshByName(entity.id);
        if (shape) {
            shape.position = entity.interpolatedPosition;
            shape.rotationQuaternion = entity.interpolatedRotationQuaternion;
            if (entity.scaling && (entity.scaling.x != 0 || entity.scaling.y != 0 || entity.scaling.z != 0)) {
                shape.scaling = entity.scaling;
            }
        }
        if (entity.oid == this.clientEngine.avatarController.avatar.id) {
            this.avatarShape = shape;
        }
        var editedEntity = this.clientEngine.state.getEditedEntity();
        if (editedEntity && this.clientEngine.model.oidIdMap[editedEntity.id] === entity.id) {
            this.clientEngine.state.stateChanged();
        }
    };
    Renderer.prototype.onUpdate = function (entity) {
        if (entity.oid == this.clientEngine.avatarController.avatar.id) {
            return;
        }
        if (this.avatarAttachments.indexOf(entity) >= 0) {
            return;
        }
        var shape = this.scene.getMeshByName(entity.id);
        if (!shape) {
            console.log("entity: " + entity.id + " (" + entity.oid + ") - Updated entity not added yet: " + entity.repo + "/" + entity.type);
            return;
        }
        shape.position = entity.interpolatedPosition;
        shape.rotationQuaternion = entity.interpolatedRotationQuaternion;
        if (entity.scaling && (entity.scaling.x != 0 || entity.scaling.y != 0 || entity.scaling.z != 0)) {
            shape.scaling = entity.scaling;
        }
        var actuator = this.clientEngine.actuatorRegister.get(entity.repo, entity.type);
        if (actuator) {
            actuator.update(this.clientEngine, entity);
        }
        var editedEntity = this.clientEngine.state.getEditedEntity();
        if (editedEntity && this.clientEngine.model.oidIdMap[editedEntity.id] === entity.id) {
            this.clientEngine.state.stateChanged();
        }
    };
    Renderer.prototype.onRemove = function (entity) {
        var actuator = this.clientEngine.actuatorRegister.get(entity.repo, entity.type);
        if (actuator) {
            actuator.remove(this.clientEngine, entity);
            console.log("entity: " + entity.id + " (" + entity.oid + ") - Removed entity type " + entity.repo + "/" + entity.type);
        }
        else {
            var shape = this.scene.getMeshByName(entity.id);
            if (shape) {
                this.scene.removeMesh(shape);
            }
        }
        var editedEntity = this.clientEngine.state.getEditedEntity();
        if (editedEntity && this.clientEngine.model.oidIdMap[editedEntity.id] === entity.id) {
            this.clientEngine.state.stateChanged();
        }
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
                var postProcess = new BABYLON.FxaaPostProcess("fxaa", 2.0, _this.camera, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, _this.engine, true);
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
                        for (var _i = 0, _a = _this.avatarAttachments; _i < _a.length; _i++) {
                            var avatarAttachment = _a[_i];
                            var actuator = _this.clientEngine.actuatorRegister.get(avatarAttachment.repo, avatarAttachment.type);
                            actuator.update(_this.clientEngine, avatarAttachment);
                        }
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
