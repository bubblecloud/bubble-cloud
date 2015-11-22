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
        };
        document.getElementById("renderCanvas").onmouseup = function (eventData) {
            if (eventData.button === 2) {
                document.exitPointerLock();
                _this.mouseLook = false;
            }
        };
        document.getElementById("renderCanvas").onmousemove = function (event) {
            if (_this.mouseLook) {
                console.log(event.movementX + ',' + event.movementY);
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
