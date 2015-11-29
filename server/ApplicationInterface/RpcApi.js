var UserDao_1 = require("../Component/UserDao");
var ServerRpcApi = (function () {
    function ServerRpcApi(serverEngine) {
        this.serverEngine = serverEngine;
    }
    ServerRpcApi.prototype.subtract = function (x, y) {
        return new Promise(function (resolve, reject) {
            return resolve(x - y);
        });
    };
    ServerRpcApi.prototype.listUsers = function () {
        return new Promise(function (resolve, reject) {
            console.log('listing users.');
            var userDao = new UserDao_1.UserDao();
            userDao.getUsers().then(function (users) {
                var idEmailMap = {};
                for (var _i = 0; _i < users.length; _i++) {
                    var user = users[_i];
                    idEmailMap[user._id] = user.email;
                }
                resolve(idEmailMap);
            }).catch(function (error) {
                console.log('Error listing users:' + error);
                reject(error);
            });
        });
    };
    ;
    ServerRpcApi.prototype.getRpcApiMethods = function () {
        var _this = this;
        return {
            'subtract': this.subtract,
            'listUsers': function () {
                return _this.listUsers();
            }
        };
    };
    return ServerRpcApi;
})();
exports.ServerRpcApi = ServerRpcApi;
