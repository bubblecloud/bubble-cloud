import {InConnection} from "./InConnection";
import {Model} from "./Model";
import {Entity} from "./Entity";
import {OutConnection} from "./OutConnection";

export class Engine {

    inConnections : InConnection[] = [];
    outConnections : OutConnection[] = [];
    model: Model = new Model();

    constructor(remoteUrls: string[]) {
        for (var remoteUrl of remoteUrls) {
            this.outConnections.push(new OutConnection(remoteUrl, this));
        }
        this.model.onAdd = (entity: Entity) => {
            for (var inConnection of this.inConnections) {
                inConnection.send(entity);
            };
            for (var outConnection of this.outConnections) {
                if (!entity.external) { // Send to other servers only objects which belong to this server
                    outConnection.send(entity);
                }
            };
        }
        this.model.onUpdate = (entity: Entity) => {
            for (var inConnection of this.inConnections) {
                inConnection.send(entity);
            };
            for (var outConnection of this.outConnections) {
                if (!entity.external) { // Send to other servers only objects which belong to this server
                    outConnection.send(entity);
                }
            };
        }
        this.model.onRemove = (entity: Entity) => {
            for (var inConnection of this.inConnections) {
                inConnection.send(entity);
            };
            for (var outConnection of this.outConnections) {
                if (!entity.external) { // Send to other servers only objects which belong to this server
                    outConnection.send(entity);
                }
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
        for (var outConnection of this.outConnections) {
            if (outConnection.disconnected()) {
                outConnection.connect();
            } else {
                if (time - outConnection.receivedTime > 5000) {
                    outConnection.disconnect();
                }
            }
        }
        console.log('in:' + this.inConnections.length + " out: " + this.outConnections.length);
    }

}