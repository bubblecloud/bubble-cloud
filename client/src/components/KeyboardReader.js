var KeyboardInputKeys = (function () {
    function KeyboardInputKeys() {
        this.left = 0;
        this.right = 0;
        this.forward = 0;
        this.back = 0;
        this.up = 0;
        this.down = 0;
    }
    return KeyboardInputKeys;
})();
var KeyboardReader = (function () {
    function KeyboardReader(engine) {
        var _this = this;
        this.keyboardKeysPressed = new KeyboardInputKeys();
        this.engine = engine;
        window.addEventListener("keydown", function (evt) {
            _this.handleKeyDown(evt);
        }, false);
        window.addEventListener("keyup", function (evt) {
            _this.handleKeyUp(evt);
        }, false);
    }
    KeyboardReader.prototype.getPressedKeys = function () {
        return this.keyboardKeysPressed;
    };
    KeyboardReader.prototype.handleKeyDown = function (evt) {
        if (evt.keyCode == 65) {
            this.keyboardKeysPressed.left = 1;
        }
        if (evt.keyCode == 68) {
            this.keyboardKeysPressed.right = 1;
        }
        if (evt.keyCode == 87) {
            this.keyboardKeysPressed.forward = 1;
        }
        if (evt.keyCode == 83) {
            this.keyboardKeysPressed.back = 1;
        }
        if (evt.keyCode == 69) {
            this.keyboardKeysPressed.up = 1;
        }
        if (evt.keyCode == 81) {
            this.keyboardKeysPressed.down = 1;
        }
    };
    KeyboardReader.prototype.handleKeyUp = function (evt) {
        if (evt.keyCode == 65) {
            this.keyboardKeysPressed.left = 0;
        }
        if (evt.keyCode == 68) {
            this.keyboardKeysPressed.right = 0;
        }
        if (evt.keyCode == 87) {
            this.keyboardKeysPressed.forward = 0;
        }
        if (evt.keyCode == 83) {
            this.keyboardKeysPressed.back = 0;
        }
        if (evt.keyCode == 69) {
            this.keyboardKeysPressed.up = 0;
        }
        if (evt.keyCode == 81) {
            this.keyboardKeysPressed.down = 0;
        }
        if (evt.keyCode == 27) {
            this.engine.state.hudVisible = !this.engine.state.hudVisible;
        }
    };
    return KeyboardReader;
})();
exports.KeyboardReader = KeyboardReader;
