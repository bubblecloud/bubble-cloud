/// <reference path="../Utilities/WsClient.ts" />
/// <reference path="../Utilities/RpcApi.ts" />

class Engine {
    intervalHandle : any;
    api:RpcApi = getProxy('rpc', RpcApi);
    ws: WsClient;

    start() {
        this.ws = new WsClient('ws://127.0.0.1:3000/ws');

        this.ws.setOnReceiveObject(function (message: any) {
            console.log(JSON.stringify(message));
        });
        var wsClient = this.ws;
        this.ws.setOnOpen(function () {
            wsClient.sendObject({'test':'message'});
        });

        this.api.subtract(44, 23).then(function (result: number) {
            console.log(result);
        }).catch(function (error) {
            console.log(error);
        });

        this.intervalHandle = setInterval(this.run, 300);
    }

    stop() {
        clearInterval(this.intervalHandle);
    }

    run() {
        console.log((new Date).getTime());
    }

}