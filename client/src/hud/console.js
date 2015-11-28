var hud_1 = require("../hud");
var Console = (function () {
    function Console() {
        var _this = this;
        this.inputLine = '';
        this.consoleOutputLinesCount = 0;
        this.mouseDown = false;
        this.consoleController = hud_1.getClientEngine().consoleController;
        this.consoleOutputLinesCount = this.consoleController.outputLines.length;
        setInterval(function () {
            _this.updateScroll();
        }, 200);
    }
    Console.prototype.onSubmit = function () {
        this.consoleController.execute(this.inputLine);
        this.inputLine = '';
    };
    Console.prototype.onMouseDown = function () {
        this.mouseDown = true;
    };
    Console.prototype.onMouseUp = function () {
        this.mouseDown = false;
    };
    Console.prototype.updateScroll = function () {
        if (this.consoleOutputLinesCount != this.consoleController.outputLines.length && !this.mouseDown) {
            $(".console-lines").scrollTop($(".console-lines")[0].scrollHeight);
            this.consoleOutputLinesCount = this.consoleController.outputLines.length;
        }
    };
    return Console;
})();
exports.Console = Console;
