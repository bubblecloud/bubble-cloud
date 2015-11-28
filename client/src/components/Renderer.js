var Engine = BABYLON.Engine;
var Scene = BABYLON.Scene;
var TargetCamera = BABYLON.TargetCamera;
var Mesh = BABYLON.Mesh;
var Vector3 = BABYLON.Vector3;
var HemisphericLight = BABYLON.HemisphericLight;
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
                var light = new HemisphericLight("light1", new Vector3(0, 1, 0), _this.scene);
                light.intensity = .5;
                var skybox = BABYLON.Mesh.CreateSphere("skyBox", 10.0, 1000.0, _this.scene);
                BABYLON.Effect.ShadersStore.gradientVertexShader = "precision mediump float;attribute vec3 position;attribute vec3 normal;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec4 vPosition;varying vec3 vNormal;void main(){vec4 p = vec4(position,1.);vPosition = p;vNormal = normal;gl_Position = worldViewProjection * p;}";
                BABYLON.Effect.ShadersStore.gradientPixelShader = "precision mediump float;uniform mat4 worldView;varying vec4 vPosition;varying vec3 vNormal;uniform float offset;uniform vec3 topColor;uniform vec3 bottomColor;void main(void){float h = normalize(vPosition+offset).y;gl_FragColor = vec4(mix(bottomColor,topColor,max(pow(max(h,0.0),0.6),0.0)),1.0);}";
                var shader = new BABYLON.ShaderMaterial("gradient", _this.scene, "gradient", {});
                shader.setFloat("offset", 10);
                shader.setColor3("topColor", BABYLON.Color3.FromInts(0, 119, 255));
                shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240, 240, 255));
                shader.backFaceCulling = false;
                skybox.material = shader;
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
