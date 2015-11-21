import {InConnection} from "./InConnection";
import {Model} from "./Model";
import {Entity} from "./Entity";
import {OutConnection} from "./OutConnection";
import dao = require('../Storage/EntityDao');

export class Engine {

    remoteServers: {key: string, any}[];
    inConnections : InConnection[] = [];
    outConnections : OutConnection[] = [];
    model: Model = new Model();
    zeroEntity: Entity;

    constructor(remoteServers: {key: string, any}[]) {
        this.remoteServers = remoteServers;

        dao.getEntity('0').then((loadedEntity : Entity) => {
            if (!loadedEntity) {
                this.zeroEntity = new Entity();
                this.zeroEntity.id = '' + 0;
                this.zeroEntity.dynamic = true;
                dao.insertEntity(this.zeroEntity);
            } else {
                this.zeroEntity = loadedEntity;
            }

            this.initialize();
        }).catch((error: Error) => {
            console.error(error);
        });

    }

    initialize() {
        dao.getEntities().then((loadedEntities : Entity[]) => {
            console.log("loaded " + loadedEntities.length + " from database.");
            for (var loadedEntity of loadedEntities) {
                this.model.put(loadedEntity);
            }

            for (var remoteServer of this.remoteServers) {
                this.outConnections.push(new OutConnection(remoteServer['url'], remoteServer['x'], remoteServer['y'], remoteServer['z'], this));
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
                if (!entity.external && !entity.dynamic) {
                    dao.insertEntity(entity);
                }
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
                if (!entity.external && !entity.dynamic) {
                    dao.updateEntity(entity);
                }
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
                if (!entity.external && !entity.dynamic) {
                    dao.removeEntity(entity._id);
                }
            }
        }).catch((error: Error) => {
            console.error(error);
        });
    }

    loop() {
        var time:number = new Date().getTime();
        for (var inConnection of this.inConnections) {
            if (time - inConnection.receivedTime > 5000) {
                inConnection.disconnect();
                this.inConnections.splice(this.inConnections.indexOf(inConnection), 1);
            }
            inConnection.send(this.zeroEntity);
        }
        for (var outConnection of this.outConnections) {
            if (outConnection.disconnected()) {
                outConnection.connect();
            } else {
                if (time - outConnection.receivedTime > 5000) {
                    outConnection.disconnect();
                }
            }
            outConnection.send(this.zeroEntity);
        }
        console.log('in:' + this.inConnections.length + " out: " + this.outConnections.length);
    }

}