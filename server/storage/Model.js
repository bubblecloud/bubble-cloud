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
            if (this.onUpdate) {
                this.onUpdate(existingEntity);
            }
        }
        else {
            this.entities[entity.id] = entity;
            if (this.onUpdate) {
                this.onAdd(entity);
            }
        }
    };
    Model.prototype.get = function (entity) {
        return this.entities[entity.id];
    };
    Model.prototype.remove = function (entity) {
        delete this.entities[entity.id];
        if (this.onRemove) {
            this.onRemove(entity);
        }
    };
    Model.prototype.keys = function () {
        return Object.keys(this.entities);
    };
    Model.prototype.setOnAdd = function (onAdd) {
        this.onAdd = onAdd;
    };
    Model.prototype.setOnUpdate = function (onUpdate) {
        this.onUpdate = onUpdate;
    };
    Model.prototype.setOnRemove = function (onRemove) {
        this.onRemove = onRemove;
    };
    return Model;
})();
exports.Model = Model;
