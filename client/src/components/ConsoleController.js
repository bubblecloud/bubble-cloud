var ConsoleController = (function () {
    function ConsoleController(clientEngine) {
        this.outputLines = [];
        this.clientEngine = clientEngine;
        this.println("Welcome to client command console.");
    }
    ConsoleController.prototype.println = function (line) {
        this.outputLines.push(line);
    };
    ConsoleController.prototype.execute = function (line) {
        this.println(' > ' + line);
        if (line === 'help') {
            this.println("Commands:");
            this.println("help - This help.");
            return;
        }
        this.println('Unknown command. You can use command "help" to list available commands.');
    };
    return ConsoleController;
})();
exports.ConsoleController = ConsoleController;
