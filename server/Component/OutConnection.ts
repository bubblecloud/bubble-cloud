import {ServerEntity} from "./ServerEntity";
import {newId} from "./ServerEntity";
import {ServerWsClient} from "./ServerWsClient";
import {ServerEngine} from "./ServerEngine";

/**
 * Outgoing connection.
 */
export class OutConnection {
    receivedTime: number = new Date().getTime();

    url: string;
    x: number;
    y: number;
    z: number;
    engine: ServerEngine;
    key: string;
    running: boolean = false;

    wsClient: ServerWsClient = null;

    oidIdMap: {[key: string]:string} = {};

    constructor(url: string, x: number, y: number, z: number, engine: ServerEngine) {
        this.url = url;
        this.x = x;
        this.y = y;
        this.z = z;
        this.engine = engine;
    }

    send: (entity: ServerEntity) => void = function (entity: ServerEntity): void {
        if (this.wsClient && this.running) {
            //console.log('sending entity to remote server: ' + entity.id)
            entity.external = true;
            entity.position.x += this.x;
            entity.position.y += this.y;
            entity.position.z += this.z;
            this.wsClient.sendObject(entity);
            entity.position.x -= this.x;
            entity.position.y -= this.y;
            entity.position.z -= this.z;
            delete entity.external;
        }
    }

    receive: (entity: ServerEntity) => void = function (entity: ServerEntity): void {
        //console.log('received entity from remote server: rid=' + entity.id + ' external: ' + entity.external);
        // TODO This could be done on server side.
        if (entity.external) { // Ignore external entities from remote server.
            return;
        }

        if (entity._id) {
            delete entity._id;
        }

        this.receivedTime = new Date().getTime();

        var oid = entity.id;
        if(!this.oidIdMap[oid]) {
            newId(entity);
            while (this.oidIdMap[oid]) { // Reallocate until free ID is found
                newId(entity);
            }
            this.oidIdMap[oid] = entity.id;
        } else {
            entity.id = this.oidIdMap[oid]
        }

        entity.external = true;
        entity.position.x -= this.x;
        entity.position.y -= this.y;
        entity.position.z -= this.z;

        this.engine.model.put(entity);
    }

    disconnect: () => void = function (): void {
        for (var oid in this.oidIdMap) {
            var id = this.oidIdMap[oid];
            var entity = this.engine.model.get(id);
            if (entity) {
                entity.removed = true;
                this.engine.model.remove(entity);
            }
        }
        this.wsClient = null;
        this.running = false;
        console.log('disconnected:' + this.url);
    }

    connect() {
        console.log('connecting:' + this.url);
        this.receivedTime = new Date().getTime();
        this.wsClient = new ServerWsClient(this.url + 'ws');
        this.wsClient.setOnOpen(()=> {
            this.running = true;
            console.log('connected:' + this.url);
            for (var key in this.engine.model.entities) {
                var entity = this.engine.model.entities[key];
                console.log('sending entity to remote server: ' + entity.id);
                if (!entity.external) {
                    this.send(entity);
                }
            }
        });
        this.wsClient.setOnReceiveObject((entity: ServerEntity) => {
            this.receive(entity);
        });
    }

    disconnected(): boolean {
        return this.wsClient == null;
    }

}
