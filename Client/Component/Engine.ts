/// <reference path="../Utilities/WsClient.ts" />
/// <reference path="../Utilities/RpcApi.ts" />

class Engine {
    api: RpcApi = getProxy('rpc', RpcApi);
    ws: WsClient;

    running: boolean = false;

    model: Model = new Model();
    avatarController: AvatarController = new AvatarController(this);
    keyboardReader: KeyboardReader = new KeyboardReader();
    mouseReader: MouseReader = new MouseReader(this);
    renderer: Renderer = new Renderer(this.model, this.keyboardReader);

    startTimeMillis: number = new Date().getTime();
    lastLoopTimeMillis: number;

    startup() {
        this.ws = new WsClient('ws://' + location.host + '/ws');

        this.ws.setOnOpen(() => {
            this.avatarController.startup();
            this.running = true;
        });

        this.ws.setOnReceiveObject( (entity: Entity) => {
            if (entity.removed) {
                this.model.remove(entity);
            } else {
                this.model.put(entity);
            }
        });

        // RPC interface test
        this.api.subtract(44, 23).then(function (result: number) {
            console.log(result);
        }).catch(function (error) {
            console.log(error);
        });

        this.renderer.startup();
        this.lastLoopTimeMillis = (new Date).getTime();
    }

    shutdown() {
        this.renderer.shutdown();
        this.avatarController.shutdown();
    }

    loop() {
        var timeMillis = (new Date).getTime();
        var timeDeltaMillis : number = timeMillis - this.lastLoopTimeMillis;

        if (this.running) {
            this.avatarController.loop(timeMillis, timeDeltaMillis);
        }

        this.lastLoopTimeMillis = timeMillis;
    }

}
