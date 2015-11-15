/// <reference path="../typings/mongodb/mongodb.d.ts" />
var dbConnection = require('../api/db-connection');
var es6_promise_1 = require('es6-promise');
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
function insertEntity(entity) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        db.collection('entities', function (error, entities) {
            if (error) {
                return reject(error);
            }
            entities.insertOne(entity, function (error, inserted) {
                if (error) {
                    return reject(error);
                }
                return resolve(inserted);
            });
        });
    });
}
exports.insertEntity = insertEntity;
function getEntity(id) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        db.collection('entities', function (error, entities) {
            if (error) {
                return reject(error);
            }
            entities.findOne({ _id: id }, function (error, foundEntity) {
                if (error) {
                    return reject(error);
                }
                return resolve(foundEntity);
            });
        });
    });
}
exports.getEntity = getEntity;
function getEntities() {
    return new es6_promise_1.Promise(function (resolve, reject) {
        db.collection('entities', function (error, entities) {
            if (error) {
                return reject(error);
            }
            entities.find().toArray(function (error, entities) {
                if (error) {
                    return reject(error);
                }
                return resolve(entities);
            });
        });
    });
}
exports.getEntities = getEntities;
function removeEntity(id) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        db.collection('entities', function (error, entities) {
            if (error) {
                return reject(error);
            }
            entities.deleteOne({ _id: id }, function (error, deletedEntity) {
                if (error) {
                    return reject(error);
                }
                resolve(deletedEntity);
            });
        });
    });
}
exports.removeEntity = removeEntity;
