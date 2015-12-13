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
import {CoreEntity} from "./ClientEntity";
import {WaterWorldModule} from "../environments/water-world/WaterWorldModule";
import {CommonModule} from "../environments/common/CommonModule";
import {ClientGrid} from "./ClientGrid";
import {MaterialRegister} from "./MaterialRegister";
import {IdRegister} from "./IdRegister";

export class ClientEngine {
    api: RpcApi = getProxy('rpc', RpcApi);
    ws: WsClient;

    running: boolean = false;

    state: ClientState = new ClientState();
    grid: ClientGrid = new ClientGrid();
    model: ClientModel = new ClientModel();

    private core: CoreEntity = new CoreEntity();

    avatarController: AvatarController = new AvatarController(this);
    keyboardReader: KeyboardReader = new KeyboardReader(this);
    mouseReader: MouseReader = new MouseReader(this);
    actuatorRegister: ActuatorRegister = new ActuatorRegister();
    materialRegister: MaterialRegister = new MaterialRegister();
    renderer: Renderer = new Renderer(this, this.model, this.keyboardReader);
    consoleController: ConsoleController = new ConsoleController(this);

    startTimeMillis: number = new Date().getTime();
    lastLoopTimeMillis: number;

    constructor() {
    }

    startup() {
        this.consoleController.println('Client starting up...');
        this.ws = new WsClient('ws://' + location.host + '/ws');

        this.ws.setOnOpen(() => {
            this.avatarController.startup();
            this.running = true;
            this.consoleController.println('Server connected.');
        });

        this.ws.setOnReceiveObject( (entity: ClientEntity) => {
            // Swap to local IDs
            var id = entity.id;
            entity.id = entity.oid;
            entity.oid = id;
            var pid = entity.pid;
            entity.pid = entity.poid;
            entity.poid = pid;

            entity.id = this.model.idRegister.processReceivedIdPair(entity.id, entity.oid, this.model.localIdRemoteIdMap, this.model.remoteIdLocalIdMap);
            if (entity.poid) {
                entity.pid = this.model.idRegister.processReceivedIdPair(entity.pid, entity.poid, this.model.localIdRemoteIdMap, this.model.remoteIdLocalIdMap);
            } else {
                entity.pid = null;
                entity.poid = null;
            }

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

        new CommonModule().load(this);
        new WaterWorldModule().load(this);

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

    getCore(): CoreEntity {
        if (!this.core) {
            this.core = <CoreEntity> this.model.copy('0', new CoreEntity());
            this.core.oid = '0';
            this.core.id = '' + this.model.idRegister.getNewId();
        } else {
            var id = this.core.id;
            this.model.copy('0', this.core);
            this.core.oid = '0';
            this.core.id = id;
        }
        return this.core;
    }

}
