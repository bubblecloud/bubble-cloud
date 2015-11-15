/// <reference path="../../typings/mongodb/mongodb.d.ts" />
var es6_promise_1 = require('es6-promise');
var database = require('./Database');
var db = database.getDatabaseConnection();
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
