var EditorState_1 = require("./EditorState");
var Matrix = BABYLON.Matrix;
var MouseReader = (function () {
    function MouseReader(engine) {
        var _this = this;
        this.mouseLook = false;
        this.movementX = 0;
        this.movementY = 0;
        this.engine = engine;
        document.getElementById("renderCanvas").onmousedown = function (eventData) {
            if (eventData.button === 2) {
                document.getElementById("renderCanvas").requestPointerLock();
                _this.mouseLook = true;
            }
            if (eventData.button === 0) {
                var pickResult = _this.engine.renderer.scene.pick(_this.engine.renderer.scene.pointerX, _this.engine.renderer.scene.pointerY);
                var id = pickResult.pickedMesh.name;
                if (_this.engine.model.entities[id]) {
                    if (_this.engine.state.editorState == EditorState_1.EditorState.PARENT_SET) {
                        _this.engine.state.editorState = EditorState_1.EditorState.NONE;
                        document.body.style.cursor = 'auto';
                        var entity = _this.engine.state.getEditedEntity();
                        if (entity) {
                            var parentEntity = _this.engine.model.clone(id);
                            var entityWorldPosition;
                            if (entity.pid) {
                                var mesh = _this.engine.renderer.scene.getMeshByName(entity.pid);
                                var worldMatrix = mesh.getWorldMatrix();
                                var worldMatrixInverted = new Matrix();
                                worldMatrix.invertToRef(worldMatrixInverted);
                                entityWorldPosition = BABYLON.Vector3.TransformCoordinates(entity.position, worldMatrix);
                            }
                            else {
                                entityWorldPosition = entity.position;
                            }
                            entity.pid = parentEntity.id;
                            entity.prid = parentEntity.rid;
                            if (entity.pid) {
                                var mesh = _this.engine.renderer.scene.getMeshByName(entity.pid);
                                var worldMatrix = mesh.getWorldMatrix();
                                var worldMatrixInverted = new Matrix();
                                worldMatrix.invertToRef(worldMatrixInverted);
                                var entityLocalPosition = BABYLON.Vector3.TransformCoordinates(entityWorldPosition, worldMatrixInverted);
                                entity.position = entityLocalPosition;
                            }
                            _this.engine.ws.sendObject(entity);
                            _this.engine.state.stateChanged();
                        }
                    }
                    else {
                        var entity = _this.engine.model.clone(id);
                        _this.engine.state.setEditedEntity(entity);
                    }
                }
            }
        };
        document.getElementById("renderCanvas").onmouseup = function (eventData) {
            if (eventData.button === 2) {
                document.exitPointerLock();
                _this.mouseLook = false;
            }
        };
        document.getElementById("renderCanvas").onmousemove = function (event) {
            if (_this.mouseLook) {
                _this.movementX += event.movementX;
                _this.movementY += event.movementY;
            }
        };
    }
    MouseReader.prototype.popMovementX = function () {
        var x = this.movementX;
        this.movementX = 0;
        return x;
    };
    MouseReader.prototype.popMovementY = function () {
        var y = this.movementY;
        this.movementY = 0;
        return y;
    };
    return MouseReader;
})();
exports.MouseReader = MouseReader;
