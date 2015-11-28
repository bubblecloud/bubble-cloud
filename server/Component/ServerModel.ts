import {ServerEntity} from "./ServerEntity";

export class ServerModel {

    entities : {[key: string]: ServerEntity} = {}

    onAdd : (entity: ServerEntity) => void;
    onUpdate : (entity: ServerEntity) => void;
    onRemove : (entity: ServerEntity) => void;

    put(entity: ServerEntity) : void {
        var existingEntity = this.entities[entity.id];
        if (existingEntity) {
            Object.getOwnPropertyNames(entity).forEach(name => {
                existingEntity[name] = entity[name];
            });
            if (this.onUpdate) {
                this.onUpdate(existingEntity);
            }
        } else {
            this.entities[entity.id] = entity;
            if (this.onUpdate) {
                this.onAdd(entity);
            }
        }
    }

    get(id: string) : ServerEntity {
        return this.entities[id];
    }

    remove(entity: ServerEntity) : void {
        delete this.entities[entity.id];
        if (this.onRemove) {
            this.onRemove(entity);
        }
    }

    keys() : string[] {
        return Object.keys(this.entities);
    }

    setOnAdd(onAdd : (entity: ServerEntity) => void) : void {
        this.onAdd = onAdd;
    }

    setOnUpdate(onUpdate : (entity: ServerEntity) => void) : void {
        this.onUpdate = onUpdate;
    }

    setOnRemove(onRemove : (entity: ServerEntity) => void) : void {
        this.onRemove = onRemove;
    }
}