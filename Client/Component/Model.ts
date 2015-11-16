class Model {

    entities : {[key: string]: Entity} = {}

    onAdd : (entity: Entity) => void;
    onUpdate : (entity: Entity) => void;
    onRemove : (entity: Entity) => void;

    put(entity: Entity) : void {
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

    get(entity: Entity) : Entity {
        return this.entities[entity.id];
    }

    remove(entity: Entity) : void {
        delete this.entities[entity.id];
        if (this.onRemove) {
            this.onRemove(entity);
        }
    }

    keys() : string[] {
        return Object.keys(this.entities);
    }

    setOnAdd(onAdd : (entity: Entity) => void) : void {
        this.onAdd = onAdd;
    }

    setOnUpdate(onUpdate : (entity: Entity) => void) : void {
        this.onUpdate = onUpdate;
    }

    setOnRemove(onRemove : (entity: Entity) => void) : void {
        this.onRemove = onRemove;
    }
}