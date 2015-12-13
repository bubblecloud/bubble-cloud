import {ServerEntity} from "./ServerEntity";
import {newId} from "./ServerEntity";
import {getNewId} from "./ServerEntity";
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

    send: (entity: ServerEntity) => void;

    receive: (entity: ServerEntity) => void = function (entity: ServerEntity): void {
        this.receivedTime = new Date().getTime();

        if (entity._id) {
            delete entity._id;
        }

        if (entity.id == '' + 0 && entity.core && entity.external) {
            this.remoteIsServer = true;
        }

        /*if (this.remoteIsServer) {
            console.log("Received: " + JSON.stringify(entity));
        }*/

        if (!entity.external) {
            entity.owner = this.email;
        }

        // Map IDs
        var oid = entity.id;
        if(!this.remoteIdLocalIdMap[oid]) {
            if (!this.remoteIsServer && entity.oid) {
                if (entity.dynamic === true) {
                    console.log('Access denied: Client attempted to write to dynamic entity it did not add in this session.');
                    return;
                }
                if (!this.engine.model.entities[entity.oid]) {
                    console.log('Access denied: Client attempted to update non existent persistent entity it did not add in this session: ' + entity.oid);
                    return;
                }
                console.log('Client updating persistent entity: ' + entity.oid);
                entity.id = entity.oid;
                this.remoteIdLocalIdMap[oid] = entity.id;
                this.localIdRemoteIdMap[entity.id] = oid;
            } else {
                newId(entity);
                while (this.remoteIdLocalIdMap[entity.id]) { // Reallocate until free ID is found
                    newId(entity);
                }
                this.remoteIdLocalIdMap[oid] = entity.id;
                this.localIdRemoteIdMap[entity.id] = oid;
            }
        } else {
            entity.id = this.remoteIdLocalIdMap[oid]
        }

        // Map parent IDs.
        var poid = entity.pid;
        if (poid) {
            if (!this.remoteIdLocalIdMap[poid]) {
                if (!this.remoteIsServer && entity.poid) {
                    entity.pid = entity.poid;
                    this.remoteIdLocalIdMap[poid] = entity.pid;
                    this.localIdRemoteIdMap[entity.pid] = poid;
                } else {
                    var pid:string = '' + getNewId();
                    while (this.remoteIdLocalIdMap[pid]) { // Reallocate until free ID is found
                        pid = '' + getNewId();
                    }
                    entity.pid = pid;
                    this.remoteIdLocalIdMap[poid] = entity.pid;
                    this.localIdRemoteIdMap[entity.pid] = poid;
                }
            } else {
                entity.pid = this.remoteIdLocalIdMap[poid]
            }
            delete entity.poid; // Delete parent original ID for new. Will be set on send.
        } else {
            entity.pid = null;
            entity.poid = null;
        }



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
