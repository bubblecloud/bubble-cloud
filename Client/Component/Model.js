var Model = (function () {
    function Model() {
        this.entities = {};
    }
    Model.prototype.put = function (entity) {
        var existingEntity = this.entities[entity.id];
        if (existingEntity) {
            Object.getOwnPropertyNames(entity).forEach(function (name) {
                existingEntity[name] = entity[name];
            });
            console.log('update:' + JSON.stringify(existingEntity));
        }
        else {
            this.entities[entity.id] = entity;
            console.log('add:' + JSON.stringify(entity));
        }
    };
    Model.prototype.get = function (entity) {
        return this.entities[entity.id];
    };
    Model.prototype.remove = function (entity) {
        delete this.entities[entity.id];
        console.log('remove:' + JSON.stringify(entity));
    };
    Model.prototype.keys = function () {
        return Object.keys(this.entities);
    };
    return Model;
})();
