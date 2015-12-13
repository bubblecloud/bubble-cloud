import {ServerEntity} from "./ServerEntity";
import {ServerEngine} from "./ServerEngine";

/**
 * Incoming connection.
 */
export class InConnection {

    receivedTime: number = new Date().getTime();

    remoteAddress: string;
    remotePort: number;
    userId: string;
    email: string;

    remoteIsServer: boolean;

    engine: ServerEngine;
    remoteIdLocalIdMap: {[key: string]:string} = {};
    localIdRemoteIdMap: {[key: string]:string} = {};

    constructor(remoteAddress: string, remotePort: number, email: string, userId: string) {
        this.remoteAddress = remoteAddress;
        this.remotePort = remotePort;
        this.email = email;
        this.userId = userId;

        console.log('connected: ' + this.remoteAddress + ':' + this.remotePort + " " + this.email);
    }

    sendObject: (object: Object) => void;

    send(entity: ServerEntity): void {
        try {
            if (this.remoteIsServer && entity.external) {
                return; // Send external objects to server only.
            }
            entity.rid = this.localIdRemoteIdMap[entity.id];
            delete entity.rid;
            delete entity.prid;
            entity.rid = this.localIdRemoteIdMap[entity.id];
            if (entity.pid) {
                entity.prid = this.localIdRemoteIdMap[entity.pid];
            }
            this.sendObject(entity);
            delete entity.rid;
            delete entity.prid;
        } catch (error) {
        }
    }

    receive(entity: ServerEntity): void {
        this.receivedTime = new Date().getTime();

        if (entity._id) {
            delete entity._id;
        }

        if (entity.id == '' + 0 && entity.core && entity.external) {
            this.remoteIsServer = true;
        }

        if (!entity.external) {
            entity.owner = this.email;
        }


        // Map IDs
        this.engine.model.idRegister.mapIdsOfReceivedEntity(entity, this.localIdRemoteIdMap, this.remoteIdLocalIdMap);

        // If entity is core then checking that user is admin
        if (entity.id === '0') {
            if (!this.engine.hasRole('admin', this.userId)) {
                console.log('Access denied: Client attempted to write to core without admin role. User ID: ' + this.userId);
                return;
            }
        }

        // If received entity is persistent check for roles.
        if (entity.external === false && entity.dynamic === false) {
            if (!this.engine.hasRole('admin', this.userId) && !this.engine.hasRole('member', this.userId)) {
                console.log('Access denied: Client attempted to persist entity without admin or member role. ' + this.userId);
                return;
            }
        }

        // If existing entity is persistent check for roles.
        if (this.engine.model.entities[entity.id]) {
            var existingEntity = this.engine.model.entities[entity.id];
            if (existingEntity.external = false && existingEntity.dynamic === false) {
                if (!this.engine.hasRole('admin', this.userId) && !this.engine.hasRole('member', this.userId)) {
                    console.log('Access denied: Client attempted to update existing persistent entity without admin or member role. ' + this.userId);
                    return;
                }
            }
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
        for (var oid in this.remoteIdLocalIdMap) {
            var id = this.remoteIdLocalIdMap[oid];
            var entity = this.engine.model.get(id);
            if (entity && (entity.dynamic || entity.external)) {
                entity.removed = true;
                this.engine.model.remove(entity);
            }
        }
        console.log('disconnected: ' + this.remoteAddress + ':' + this.remotePort + " " + this.email);
    }


}
