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
        for (var oid in this.idMap) {
            var id = this.idMap[oid];
            var entity = this.engine.model.get(id);
            entity.removed = true;
            this.engine.model.remove(entity);
        }
    }


}
