var hud_1 = require("../hud");
var Matrix = BABYLON.Matrix;
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
        var entityWorldPosition = this.engine.avatarController.avatar.position.clone();
        var entityLocalPosition;
        var entityWorldRotation = new Matrix();
        this.engine.avatarController.avatar.rotationQuaternion.toRotationMatrix(entityWorldRotation);
        var entityLocalRotation;
        var parentEntity = this.engine.state.getEditedEntity();
        if (parentEntity) {
            newEntity.pid = parentEntity.id;
            newEntity.prid = parentEntity.rid;
            var mesh = this.engine.renderer.scene.getMeshByName(newEntity.pid);
            var worldMatrix = mesh.getWorldMatrix();
            var worldMatrixInverted = new Matrix();
            worldMatrix.invertToRef(worldMatrixInverted);
            entityLocalPosition = BABYLON.Vector3.TransformCoordinates(entityWorldPosition, worldMatrixInverted);
            entityLocalRotation = entityWorldRotation.multiply(worldMatrixInverted);
        }
        else {
            entityLocalPosition = entityWorldPosition;
            entityLocalRotation = entityWorldRotation;
        }
        newEntity.dynamic = false;
        newEntity.position = entityLocalPosition;
        newEntity.rotationQuaternion.fromRotationMatrix(entityLocalRotation);
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
