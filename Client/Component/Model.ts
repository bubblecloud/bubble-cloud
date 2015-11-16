class Model {

    entities : {[key: string]: Entity} = {}

    put(entity: Entity) : void {
        var existingEntity = this.entities[entity.id];
        if (existingEntity) {
            Object.getOwnPropertyNames(entity).forEach(name => {
                existingEntity[name] = entity[name];
            });
            console.log('update:' + JSON.stringify(existingEntity));
        } else {
            this.entities[entity.id] = entity;
            console.log('add:' + JSON.stringify(entity));
        }
    }

    get(entity: Entity) : Entity {
        return this.entities[entity.id];
    }

    remove(entity: Entity) : void {
        delete this.entities[entity.id];
        console.log('remove:' + JSON.stringify(entity));
    }

    keys() : string[] {
        return Object.keys(this.entities);
    }
}