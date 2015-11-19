/**
 * Incoming connection.
 */
export class InConnection {
    engine: Engine;
    key: string;
    email: string;
    receivedTime: number;
    entities: Entity[] = [];

    send: (entity: Entity) => void;

    receive: (entity: Entity) => void = function (entity: Entity): void {
        this.receivedTime = new Date().getTime();
        //this.send(entity);
        this.engine.model.put(entity);
    }

    disconnect: () => void = function (): void {

    }


}
