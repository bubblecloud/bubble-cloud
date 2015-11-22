var KeyboardInputKeys = (function () {
    function KeyboardInputKeys() {
        this.left = 0;
        this.right = 0;
        this.forward = 0;
        this.back = 0;
    }
    return KeyboardInputKeys;
})();
var keyboardKeysPressed = new KeyboardInputKeys();
window.addEventListener("keydown", handleKeyDown, false);
window.addEventListener("keyup", handleKeyUp, false);
function handleKeyDown(evt) {
    if (evt.keyCode == 65) {
        keyboardKeysPressed.left = 1;
    }
    if (evt.keyCode == 68) {
        keyboardKeysPressed.right = 1;
    }
    if (evt.keyCode == 87) {
        keyboardKeysPressed.forward = 1;
    }
    if (evt.keyCode == 83) {
        keyboardKeysPressed.back = 1;
    }
}
function handleKeyUp(evt) {
    if (evt.keyCode == 65) {
        keyboardKeysPressed.left = 0;
    }
    if (evt.keyCode == 68) {
        keyboardKeysPressed.right = 0;
    }
    if (evt.keyCode == 87) {
        keyboardKeysPressed.forward = 0;
    }
    if (evt.keyCode == 83) {
        keyboardKeysPressed.back = 0;
    }
}
var KeyboardReader = (function () {
    function KeyboardReader() {
    }
    KeyboardReader.prototype.getPressedKeys = function () {
        return keyboardKeysPressed;
    };
    return KeyboardReader;
})();
