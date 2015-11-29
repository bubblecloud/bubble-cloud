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
        if (line.indexOf('grant') === 0) {
            this.grant(line);
            return;
        }
        if (line.indexOf('revoke') === 0) {
            this.revoke(line);
            return;
        }
        this.println('Unknown command. You can use command "help" to list available commands.');
    };
    ConsoleController.prototype.help = function () {
        this.println("Commands:");
        this.println("help - This help.");
        this.println("list users - List of system users.");
        this.println("grant <role={admin, member}> <email> - Grant role to a user.");
        this.println("revoke <role={admin, member}> <email> - Revoke role from a user.");
    };
    ConsoleController.prototype.listUsers = function () {
        var _this = this;
        this.clientEngine.api.listUsers().then(function (idEmailMap) {
            _this.println('Users:');
            for (var id in idEmailMap) {
                _this.println('id: ' + id + ' email:' + idEmailMap[id]);
            }
        }).catch(function (error) {
            _this.println('Error listing users: ' + error);
        });
    };
    ConsoleController.prototype.grant = function (line) {
        var _this = this;
        var parts = line.split(' ');
        if (parts.length != 3) {
            this.println("Invalid syntax: " + line);
            return;
        }
        var role = parts[1];
        if (role !== 'admin' && role !== 'member') {
            this.println('Error: ' + role + ' is not supported role.');
            return;
        }
        var email = parts[2];
        this.clientEngine.api.listUsers().then(function (idEmailMap) {
            var matchCount = 0;
            var userIdMatch;
            var userEmailMatch;
            for (var userId in idEmailMap) {
                if (idEmailMap[userId] === email) {
                    userIdMatch = userId;
                    userEmailMatch = idEmailMap[userId];
                    matchCount++;
                    _this.println('Matching user id: ' + userId + ' email:' + userEmailMatch);
                }
            }
            if (matchCount != 1) {
                _this.println('Error: Number of matching users was not 1.');
                return;
            }
            var core = _this.clientEngine.getCore();
            if (!core) {
                _this.println('Error: server core not available.');
                return;
            }
            if (!core.hasRole(role, userIdMatch)) {
                core.grantRole(role, userIdMatch);
                _this.clientEngine.ws.sendObject(core);
                _this.println('Success: granted ' + userEmailMatch + ' ' + role + ' role.');
                return;
            }
            else {
                _this.println('Error: user already has the role.');
                return;
            }
        }).catch(function (error) {
            _this.println('Error listing users: ' + error);
            return;
        });
    };
    ConsoleController.prototype.revoke = function (line) {
        var _this = this;
        var parts = line.split(' ');
        if (parts.length != 3) {
            this.println("Invalid syntax: " + line);
            return;
        }
        var role = parts[1];
        if (role !== 'admin' && role !== 'member') {
            this.println('Error: ' + role + ' is not supported role.');
            return;
        }
        var email = parts[2];
        this.clientEngine.api.listUsers().then(function (idEmailMap) {
            var matchCount = 0;
            var userIdMatch;
            var userEmailMatch;
            for (var userId in idEmailMap) {
                if (idEmailMap[userId] === email) {
                    userIdMatch = userId;
                    userEmailMatch = idEmailMap[userId];
                    matchCount++;
                    _this.println('Matching user id: ' + userId + ' email:' + userEmailMatch);
                }
            }
            if (matchCount != 1) {
                _this.println('Error: Number of matching users was not 1.');
                return;
            }
            var core = _this.clientEngine.getCore();
            if (!core) {
                _this.println('Error: server core not available.');
                return;
            }
            if (core.hasRole(role, userIdMatch)) {
                core.revokeRole(role, userIdMatch);
                _this.clientEngine.ws.sendObject(core);
                _this.println('Success: revoked ' + userEmailMatch + ' ' + role + ' role.');
                return;
            }
            else {
                _this.println('Error: user did not have the role.');
                return;
            }
        }).catch(function (error) {
            _this.println('Error listing users: ' + error);
            return;
        });
    };
    return ConsoleController;
})();
exports.ConsoleController = ConsoleController;
