import {Entity} from "./Entity";
import {newId} from "./Entity";
import {ServerWsClient} from "./ServerWsClient";
import {Engine} from "./Engine";

/**
 * Outgoing connection.
 */
export class OutConnection {
    receivedTime: number = new Date().getTime();

    url: string;
    engine: Engine;
    key: string;
    connected: boolean;

    wsClient: ServerWsClient = null;

    idMap: {[key: string]:string} = {};

    constructor(url: string, engine: Engine) {
        this.url = url;
        this.engine = engine;
    }

    send: (entity: Entity) => void = function (entity: Entity): void {
        if (this.wsClient && this.connected) {
            entity.external = true;
            this.wsClient.sendObject(entity);
            delete entity.external;
        }
    }

    receive: (entity: Entity) => void = function (entity: Entity): void {
        // TODO This could be done on server side.
        if (entity.external) { // Ignore external entities from remote server.
            return;
        }
        this.receivedTime = new Date().getTime();

        if(!this.idMap[entity.id]) {
            newId(entity);
            this.idMap[entity.oid] = entity.id;
        } else {
            entity.oid = entity.id;
            entity.id = this.idMap[entity.oid]
        }

        this.engine.model.put(entity);
    }

    disconnect: () => void = function (): void {
        for (var oid in this.idMap) {
            var id = this.idMap[oid];
            var entity = this.engine.model.get(id);
            entity.removed = true;
            this.engine.model.remove(entity);
        }
        this.wsClient = null;
        this.connected = false;
        console.log('disconnected:' + this.url);
    }

    connect() {
        console.log('connecting:' + this.url);
        this.receivedTime = new Date().getTime();
        this.wsClient = new ServerWsClient(this.url + 'ws');
        this.wsClient.setOnOpen(()=> {
            this.connected = true;
            console.log('connected:' + this.url);
        });
        this.wsClient.setOnReceiveObject((entity: Entity) => {
            this.receive(entity);
        });
    }

    disconnected(): boolean {
        return this.wsClient == null;
    }

}
