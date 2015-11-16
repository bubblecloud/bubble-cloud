/// <reference path="./RpcClient.ts" />
var RpcApi = (function () {
    function RpcApi() {
    }
    RpcApi.prototype.subtract = function (x, y) { return null; };
    ;
    return RpcApi;
})();
function getProxy(url, proxyClass) {
    var proxy = new Object();
    var rpcClient = new RpcClient(url);
    Object.getOwnPropertyNames(proxyClass.prototype).forEach(function (name) {
        proxy[name] = function prototype() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return new Promise(function (resolve, reject) {
                rpcClient.invoke(name, args).then(function (result) {
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            });
        };
    });
    return proxy;
}
