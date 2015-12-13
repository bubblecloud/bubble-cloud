import {ServerEntity} from "./ServerEntity";
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

    remoteIdLocalIdMap: {[key: string]:string} = {};

    constructor(url: string, x: number, y: number, z: number, engine: ServerEngine) {
        this.url = url;
        this.x = x;
        this.y = y;
        this.z = z;
        this.engine = engine;
    }

    send (entity: ServerEntity): void {
        if (this.wsClient && this.running) {
            //console.log('sending entity to remote server: ' + entity.id)
            delete entity.rid;
            delete entity.prid;
            entity.external = true;
            if (!entity.pid) {
                entity.position.x += this.x;
                entity.position.y += this.y;
                entity.position.z += this.z;
            }
            this.wsClient.sendObject(entity);
            if (!entity.pid) {
                entity.position.x -= this.x;
                entity.position.y -= this.y;
                entity.position.z -= this.z;
            }
            delete entity.external;
        }
    }

    receive(entity: ServerEntity): void {
        //console.log('received entity from remote server: rid=' + entity.id + ' external: ' + entity.external);
        // TODO This could be done on server side.
        if (entity.external) { // Ignore external entities from remote server.
            return;
        }

        if (entity._id) {
            delete entity._id;
        }

        this.receivedTime = new Date().getTime();

        var rid = entity.id;
        if(!this.remoteIdLocalIdMap[rid]) {
            entity.id = '' + this.engine.model.idRegister.getNewId();
            /*while (this.remoteIdLocalIdMap[rid]) { // Reallocate until free ID is found
                entity.id = '' + this.engine.model.idRegister.getNewId();
            }*/
            this.remoteIdLocalIdMap[rid] = entity.id;
        } else {
            entity.id = this.remoteIdLocalIdMap[rid]
        }

        // Map parent original ID.
        var prid = entity.pid;
        if (prid) {
            if (!this.remoteIdLocalIdMap[prid]) {
                var pid:string = '' + this.engine.model.idRegister.getNewId();
               /*while (this.remoteIdLocalIdMap[prid]) { // Reallocate until free ID is found
                    pid = '' + this.engine.model.idRegister.getNewId();
                }*/
                entity.pid = pid;
                this.remoteIdLocalIdMap[prid] = entity.pid;
            } else {
                entity.pid = this.remoteIdLocalIdMap[prid]
            }
            delete entity.prid; // Delete parent original ID for new. Will be set on send.
        } else {
            entity.pid = null;
            entity.prid = null;
        }

        entity.external = true;
        if (!entity.pid) {
            entity.position.x -= this.x;
            entity.position.y -= this.y;
            entity.position.z -= this.z;
        }

        if (entity.id === '0') {
            return;
        }

        // If entity is core then checking that user is admin
        if (entity.id === '0') {
            console.log('Access denied: Remote server tried to write to core:' + entity.id);
            return;
        }

        // If received entity is persistent check for roles.
        if (entity.external === false && entity.dynamic === false) {
            console.log('Access denied: Remote server tried to write to persistent entity:' + entity.id);
            return;
        }

        // If existing entity is persistent check for roles.
        if (this.engine.model.entities[entity.id]) {
            var existingEntity = this.engine.model.entities[entity.id];
            if (existingEntity.external = false && existingEntity.dynamic === false) {
                console.log('Access denied: Remote server tried to write to persistent entity:' + entity.id);
            }
        }

        this.engine.model.put(entity);
    }

    disconnect: () => void = function (): void {
        for (var oid in this.remoteIdLocalIdMap) {
            var id = this.remoteIdLocalIdMap[oid];
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
