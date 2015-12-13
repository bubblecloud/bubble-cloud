var hud_1 = require("../hud");
var EntityAdd = (function () {
    function EntityAdd() {
        this.entityTypes = [
            { type: 'surface', label: 'Surface' },
            { type: 'primitive', label: 'Primitive' },
            { type: 'model', label: 'Model' }
        ];
        this.engine = hud_1.getClientEngine();
    }
    EntityAdd.prototype.addEntity = function () {
        var actuator = this.engine.actuatorRegister.get('default', this.addEntityType);
        var newEntity = actuator.construct(this.engine);
        newEntity.dynamic = false;
        newEntity.position = this.engine.avatarController.avatar.position.clone();
        newEntity.rotationQuaternion = this.engine.avatarController.avatar.rotationQuaternion.clone();
        this.engine.ws.sendObject(newEntity);
        this.engine.state.setEditedEntity(newEntity);
    };
    EntityAdd.prototype.removeEntity = function () {
        var entity = this.engine.state.getEditedEntity();
        if (entity) {
            entity.removed = true;
            this.engine.ws.sendObject(entity);
        }
    };
    EntityAdd.prototype.deselectEntity = function () {
        this.engine.state.setEditedEntity(null);
    };
    return EntityAdd;
})();
exports.EntityAdd = EntityAdd;
