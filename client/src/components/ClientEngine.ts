import {ClientModel} from "./ClientModel";
import {AvatarController} from "./AvatarController";
import {KeyboardReader} from "./KeyboardReader";
import {MouseReader} from "./MouseReader";
import {Renderer} from "./Renderer";
import {ClientEntity} from "./ClientEntity";
import {RpcApi} from "../Utilities/RpcApi";
import {getProxy} from "../Utilities/RpcApi";
import {WsClient} from "../Utilities/WsClient";
import {ConsoleController} from "./ConsoleController";
import {ClientState} from "./ClientState";
import {ActuatorRegister} from "./ActuatorRegister";

export class ClientEngine {
    api: RpcApi = getProxy('rpc', RpcApi);
    ws: WsClient;

    running: boolean = false;

    state: ClientState = new ClientState();
    model: ClientModel = new ClientModel();
    avatarController: AvatarController = new AvatarController(this);
    keyboardReader: KeyboardReader = new KeyboardReader(this);
    mouseReader: MouseReader = new MouseReader(this);
    actuatorRegister: ActuatorRegister = new ActuatorRegister();
    renderer: Renderer = new Renderer(this, this.model, this.keyboardReader);
    consoleController: ConsoleController = new ConsoleController(this);

    startTimeMillis: number = new Date().getTime();
    lastLoopTimeMillis: number;

    startup() {
        this.consoleController.println('Client starting up...');
        this.ws = new WsClient('ws://' + location.host + '/ws');

        this.ws.setOnOpen(() => {
            this.avatarController.startup();
            this.running = true;
            this.consoleController.println('Server connected.');
        });

        this.ws.setOnReceiveObject( (entity: ClientEntity) => {
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

        this.consoleController.println('Client started.');
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
