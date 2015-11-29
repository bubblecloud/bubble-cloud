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
            this.help();
            return;
        }
        if (line.indexOf('list users') === 0) {
            this.listUsers();
            return;
        }
        this.println('Unknown command. You can use command "help" to list available commands.');
    };
    ConsoleController.prototype.help = function () {
        this.println("Commands:");
        this.println("help - This help.");
        this.println("list users - List of system users.");
    };
    ConsoleController.prototype.listUsers = function () {
        var _this = this;
        this.clientEngine.api.listUsers().then(function (idEmailMap) {
            _this.println('Users:');
            for (var id in idEmailMap) {
                _this.println('id: ' + id + ' email:' + idEmailMap[id]);
            }
        }).catch(function (error) {
            console.log('Error listing users: ' + error);
        });
    };
    return ConsoleController;
})();
exports.ConsoleController = ConsoleController;
