import {ServerEntity} from "./ServerEntity";
import {newId} from "./ServerEntity";
import {ServerEngine} from "./ServerEngine";

/**
 * Incoming connection.
 */
export class InConnection {

    receivedTime: number = new Date().getTime();

    remoteAddress: string;
    remotePort: number;
    email: string;

    remoteIsServer: boolean;

    engine: ServerEngine;
    oidIdMap: {[key: string]:string} = {};
    idOIdMap: {[key: string]:string} = {};

    constructor(remoteAddress: string, remotePort: number, email: string) {
        this.remoteAddress = remoteAddress;
        this.remotePort = remotePort;
        this.email = email;

        console.log('connected: ' + this.remoteAddress + ':' + this.remotePort + " " + this.email);
    }

    send: (entity: ServerEntity) => void;

    receive: (entity: ServerEntity) => void = function (entity: ServerEntity): void {
        this.receivedTime = new Date().getTime();

        if (entity._id) {
            delete entity._id;
        }

        if (entity.id == '' + 0 && entity.core) {
            this.remoteIsServer = true;
        }

        if (!entity.external) {
            entity.owner = this.email;
        }

        var oid = entity.id;
        if(!this.oidIdMap[oid]) {
            newId(entity);
            while (this.oidIdMap[entity.id]) { // Reallocate until free ID is found
                newId(entity);
            }
            this.oidIdMap[oid] = entity.id;
            this.idOIdMap[entity.id] = oid;
        } else {
            entity.id = this.oidIdMap[oid]
        }

        this.engine.model.put(entity);
    }

    connect: () => void = function (): void {
        for (var key in this.engine.model.entities) {
            var entity = this.engine.model.entities[key];
            if (this.remoteIsServer && entity.external) {
                continue; // Send external entities to clients only.
            }
            //console.log('sending entity to remote server: ' + entity.id + ' ' + entity.repo + '/' + entity.type);
            this.send(entity);
        }
    }

    disconnect: () => void = function (): void {
        for (var oid in this.oidIdMap) {
            var id = this.oidIdMap[oid];
            var entity = this.engine.model.get(id);
            if (entity.dynamic) {
                entity.removed = true;
                this.engine.model.remove(entity);
            }
        }
        console.log('disconnected: ' + this.remoteAddress + ':' + this.remotePort + " " + this.email);
    }


}
