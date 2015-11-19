import {InConnection} from "./InConnection";
import {Model} from "./Model";
import {Entity} from "./Entity";

export class Engine {

    inConnections : InConnection[] = [];
    model: Model = new Model();

    constructor() {
        this.model.onAdd = (entity: Entity) => {
            for (var inConnection of this.inConnections) {
                inConnection.send(entity);
            };
        }
        this.model.onUpdate = (entity: Entity) => {
            for (var inConnection of this.inConnections) {
                inConnection.send(entity);
            };
        }
        this.model.onRemove = (entity: Entity) => {
            for (var inConnection of this.inConnections) {
                inConnection.send(entity);
            };
        }
    }

    loop() {
        var time:number = new Date().getTime();
        for (var inConnection of this.inConnections) {
            if (time - inConnection.receivedTime > 5000) {
                inConnection.disconnect();
                this.inConnections.splice(this.inConnections.indexOf(inConnection), 1);
            }
        }
        console.log(this.inConnections.length);
    }

}