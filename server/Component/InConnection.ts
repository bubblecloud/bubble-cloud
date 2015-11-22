import {ServerEntity} from "./ServerEntity";
import {newId} from "./ServerEntity";

/**
 * Incoming connection.
 */
export class InConnection {

    receivedTime: number = new Date().getTime();

    remoteAddress: string;
    remotePort: number;
    email: string;

    remoteIsServer: boolean;

    engine: ClientEngine;
    idMap: {[key: string]:string} = {};

    constructor(remoteAddress: string, remotePort: number, email: string) {
        this.remoteAddress = remoteAddress;
        this.remotePort = remotePort;
        this.email = email;

        console.log('connected: ' + this.remoteAddress + ':' + this.remotePort + " " + this.email);
    }

    send: (entity: ServerEntity) => void;

    receive: (entity: ServerEntity) => void = function (entity: ServerEntity): void {
        this.receivedTime = new Date().getTime();

        if (entity.id == '' + 0 && entity.core) {
            this.remoteIsServer = true;
        }

        if(!this.idMap[entity.id]) {
            newId(entity);
            while (this.idMap[entity.id]) { // Reallocate until free ID is found
                newId(entity);
            }
            this.idMap[entity.oid] = entity.id;
        } else {
            entity.oid = entity.id;
            entity.id = this.idMap[entity.oid]
        }

        this.engine.model.put(entity);
    }

    connect: () => void = function (): void {
        for (var key in this.engine.model.entities) {
            var entity = this.engine.model.entities[key];
            if (this.remoteIsServer && entity.external) {
                continue; // Send external entities to clients only.
            }
            this.send(entity);
        }
    }

    disconnect: () => void = function (): void {
        for (var oid in this.idMap) {
            var id = this.idMap[oid];
            var entity = this.engine.model.get(id);
            if (entity.dynamic) {
                entity.removed = true;
                this.engine.model.remove(entity);
            }
        }
        console.log('disconnected: ' + this.remoteAddress + ':' + this.remotePort + " " + this.email);
    }


}
