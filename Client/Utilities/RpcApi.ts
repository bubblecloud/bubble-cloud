/// <reference path="./RpcClient.ts" />
class RpcApi {
    subtract(x: number, y: number): Promise<number> { return null };
}

function getProxy(url: string, proxyClass: any): any {
    var proxy = new Object();
    var rpcClient = new RpcClient(url);
    Object.getOwnPropertyNames(proxyClass.prototype).forEach(name => {
        proxy[name] = function prototype(...args): Promise<any> {
            return new Promise<Object>(function (resolve, reject) {
                rpcClient.invoke(name, args).then(function (result) {
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
    })
    return proxy;
}

//populateProxy(RpcApi);
