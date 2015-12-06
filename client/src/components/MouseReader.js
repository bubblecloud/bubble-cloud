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
                    var entity = _this.engine.model.clone(id);
                    _this.engine.ws.sendObject(entity);
                    _this.engine.state.setEditedEntity(entity);
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
