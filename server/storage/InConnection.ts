import {Entity} from "./Entity";
import {newId} from "./Entity";

/**
 * Incoming connection.
 */
export class InConnection {
    engine: Engine;
    key: string;
    email: string;
    receivedTime: number;
    entities: Entity[] = [];
    idMap: {[key: string]:string} = {};

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

    disconnect: () => void = function (): void {

    }


}
