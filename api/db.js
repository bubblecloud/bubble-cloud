/// <reference path="../typings/mongodb/mongodb.d.ts" />
var dbConnection = require('../api/db-connection');
var db = dbConnection.getDatabaseConnection();
var Vector3 = (function () {
    function Vector3() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    return Vector3;
})();
exports.Vector3 = Vector3;
var Quaternion = (function () {
    function Quaternion() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }
    return Quaternion;
})();
exports.Quaternion = Quaternion;
var Entity = (function () {
    function Entity() {
        this.position = new Vector3();
        this.rotationQuaternion = new Quaternion();
        this.scaling = new Vector3();
    }
    return Entity;
})();
exports.Entity = Entity;
function insertEntity(entity, callback) {
    db.collection('entities', function (error, entities) {
        if (error) {
            console.error("Error:" + error);
            callback(error, null);
            return;
        }
        entities.insertOne(entity, function (error, insertedEntity) {
            if (error) {
                console.error("Error:" + error);
            }
            callback(error, insertedEntity);
        });
    });
}
exports.insertEntity = insertEntity;
function getEntity(id, callback) {
    db.collection('entities', function (error, entities) {
        if (error) {
            console.error(error);
            callback(error, null);
        }
        entities.findOne({ _id: id }, function (error, foundEntity) {
            if (error) {
                console.error(error);
            }
            callback(error, foundEntity);
        });
    });
}
exports.getEntity = getEntity;
function getEntities(id, callback) {
    db.collection('entities', function (error, entities) {
        if (error) {
            console.error(error);
            callback(error, null);
        }
        entities.find({ _id: id }).toArray(function (error, entities) {
            if (error) {
                console.error(error);
            }
            callback(error, entities);
        });
    });
}
exports.getEntities = getEntities;
function removeEntity(id, callback) {
    db.collection('entities', function (error, entities) {
        if (error) {
            console.error(error);
            return;
        }
        entities.deleteOne({ _id: id }, function (error, deletedEntity) {
            if (error) {
                console.error(error);
                callback(error, null);
            }
            callback(error, deletedEntity);
        });
    });
}
exports.removeEntity = removeEntity;
