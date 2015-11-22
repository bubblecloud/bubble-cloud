var MouseReader = (function () {
    function MouseReader(engine) {
        this.engine = engine;
        document.getElementById("renderCanvas").onmousedown = function (eventData) {
            if (eventData.button === 2) {
                this.requestPointerLock();
            }
        };
        document.getElementById("renderCanvas").onmouseup = function (eventData) {
            if (eventData.button === 2) {
                document.exitPointerLock();
            }
        };
    }
    return MouseReader;
})();
