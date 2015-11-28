var ConsoleController = (function () {
    function ConsoleController(clientEngine) {
        this.outputLines = [];
        this.clientEngine = clientEngine;
    }
    ConsoleController.prototype.println = function (line) {
        this.outputLines.push(line);
    };
    return ConsoleController;
})();
exports.ConsoleController = ConsoleController;
