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
    startTimeMillis: number = new Date().getTime();
    lastLoopTimeMillis: number;
    avatar: Entity = new Entity();

    start() {
        var timeMillis = (new Date).getTime();
        this.avatar.newId();
        this.avatar.dynamic = true;
        this.avatar.position.x = 3 * Math.cos(2 * Math.PI * ((timeMillis - this.startTimeMillis)/10000));
        this.avatar.position.z = 3 * Math.sin(2 * Math.PI * ((timeMillis - this.startTimeMillis)/10000));
        this.avatar.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2 * Math.PI * ((timeMillis - this.startTimeMillis)/10000), 0, 0);
        this.ws = new WsClient('ws://' + location.host + '/ws');

        this.ws.setOnReceiveObject( (entity: Entity) => {
            if (entity.removed) {
                this.model.remove(entity);
            } else {
                this.model.put(entity);
            }
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
        this.avatar.position.x = 3 * Math.cos(2 * Math.PI * ((timeMillis - this.startTimeMillis)/10000));
        this.avatar.position.z = 3 * Math.sin(2 * Math.PI * ((timeMillis - this.startTimeMillis)/10000));
        this.avatar.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2 * Math.PI * ((timeMillis - this.startTimeMillis)/10000), 0, 0);
        this.ws.sendObject({'id':this.avatar.id,'position':this.avatar.position, 'rotationQuaternion': this.avatar.rotationQuaternion});

        var timeDeltaMillis : number = timeMillis - this.lastLoopTimeMillis;
        this.lastLoopTimeMillis = timeMillis;

        //80*Math.sin(t*0.7);
    }

}
