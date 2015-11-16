/// <reference path="./RpcClient.ts" />
var rpc = new RpcClient("rpc");
var ServerApiProxy = (function () {
    function ServerApiProxy() {
    }
    ServerApiProxy.prototype.subtract = function (x, y) { return null; };
    ;
    return ServerApiProxy;
})();
function populateProxy(proxyClass) {
    Object.getOwnPropertyNames(proxyClass.prototype).forEach(function (name) {
        proxyClass.prototype[name] = function prototype() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return new Promise(function (resolve, reject) {
                rpc.invoke(name, args).then(function (result) {
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            });
        };
    });
}
populateProxy(ServerApiProxy);
