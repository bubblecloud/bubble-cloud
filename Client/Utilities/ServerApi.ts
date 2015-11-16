/// <reference path="./RpcClient.ts" />

var rpc = new RpcClient("rpc");

class ServerApiProxy {
    subtract(x: number, y: number): Promise<number> { return null };
}

function populateProxy(proxyClass: any) {
    Object.getOwnPropertyNames(proxyClass.prototype).forEach(name => {
        proxyClass.prototype[name] = function prototype(...args): Promise<any> {
            return new Promise<Object>(function (resolve, reject) {
                rpc.invoke(name, args).then(function (result) {
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
    })
}

populateProxy(ServerApiProxy);

/*
 function subtract(...args): Promise<any> {
 return new Promise<Object>(function (resolve, reject) {
 rpc.invoke('subtract', args).then(function (result) {
 resolve(result);
 }).catch(function (error) {
 reject(error);
 });
 });
 }
 */