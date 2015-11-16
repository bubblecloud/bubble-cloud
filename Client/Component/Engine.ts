/// <reference path="../Utilities/WsClient.ts" />
/// <reference path="../Utilities/RpcApi.ts" />

function runLoop() {
    console.log((new Date).getTime());
    //engine.loop();
}

class Engine {
    api: RpcApi = getProxy('rpc', RpcApi);
    ws: WsClient;
    model: Model = new Model();
    renderer: Renderer = new Renderer(this.model);
    lastLoopTimeMillis: number;
    avatar: Entity = new Entity();

    start() {
        this.avatar.newId();
        this.ws = new WsClient('ws://127.0.0.1:3000/ws');

        this.ws.setOnReceiveObject( (message: any) => {
            this.model.put(message);
        });
        var wsClient = this.ws;
        this.ws.setOnOpen(() => {
            this.ws.sendObject(this.avatar);
            //wsClient.sendObject({'test':'message'});
        });

        this.api.subtract(44, 23).then(function (result: number) {
            console.log(result);
        }).catch(function (error) {
            console.log(error);
        });

        this.renderer.start();
        this.lastLoopTimeMillis = (new Date).getTime();
    }

    stop() {
    }

    loop() {
        var timeMillis = (new Date).getTime();
        var timeDeltaMillis : number = timeMillis - this.lastLoopTimeMillis;

        this.lastLoopTimeMillis = timeMillis;
        this.avatar.position.x = 100*Math.sin(2 * Math.PI * (timeMillis/10000));
        this.ws.sendObject({'id':this.avatar.id,'position':this.avatar.position});
        //80*Math.sin(t*0.7);
    }

}
