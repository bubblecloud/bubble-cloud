import {Entity} from "./Entity";
import {newId} from "./Entity";

/**
 * Incoming connection.
 */
export class InConnection {

    receivedTime: number = new Date().getTime();

    remoteAddress: string;
    remotePort: number;
    email: string;

    engine: Engine;
    idMap: {[key: string]:string} = {};

    constructor(remoteAddress: string, remotePort: number, email: string) {
        this.remoteAddress = remoteAddress;
        this.remotePort = remotePort;
        this.email = email;

        console.log('connected: ' + this.remoteAddress + ':' + this.remotePort + " " + this.email);
    }

    send: (entity: Entity) => void;

    receive: (entity: Entity) => void = function (entity: Entity): void {
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

    connect: () => void = function (): void {
        for (var key in this.engine.model.entities) {
            var entity = this.engine.model.entities[key];
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
