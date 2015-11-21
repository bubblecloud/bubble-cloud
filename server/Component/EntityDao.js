/// <reference path="../../typings/mongodb/mongodb.d.ts" />
var es6_promise_1 = require('es6-promise');
var database = require('./Database');
function insertEntity(entity) {
    console.log('entity db insert:' + entity.id);
    return new es6_promise_1.Promise(function (resolve, reject) {
        var db = database.getDatabaseConnection();
        db.collection('entities', function (error, entities) {
            if (error) {
                console.error('entity insert error: ' + error.message);
                return reject(error);
            }
            entities.insertOne(entity, function (error, inserted) {
                if (error) {
                    console.error('entity insert error: ' + error.message);
                    return reject(error);
                }
                return resolve(inserted);
            });
        });
    });
}
exports.insertEntity = insertEntity;
function updateEntity(entity) {
    console.log('entity db update:' + entity.id);
    return new es6_promise_1.Promise(function (resolve, reject) {
        var db = database.getDatabaseConnection();
        db.collection('entities', function (error, entities) {
            if (error) {
                return reject(error);
            }
            entities.updateOne({ id: entity.id }, entity, function (error, inserted) {
                if (error) {
                    return reject(error);
                }
                return resolve(inserted);
            });
        });
    });
}
exports.updateEntity = updateEntity;
function getEntity(id) {
    console.log('entity db get:' + id);
    return new es6_promise_1.Promise(function (resolve, reject) {
        var db = database.getDatabaseConnection();
        db.collection('entities', function (error, entities) {
            if (error) {
                return reject(error);
            }
            entities.findOne({ id: id }, function (error, foundEntity) {
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
        var db = database.getDatabaseConnection();
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
    console.log('entity db delete:' + id);
    return new es6_promise_1.Promise(function (resolve, reject) {
        var db = database.getDatabaseConnection();
        db.collection('entities', function (error, entities) {
            if (error) {
                return reject(error);
            }
            entities.deleteOne({ id: id }, function (error, deletedEntity) {
                if (error) {
                    return reject(error);
                }
                resolve(deletedEntity);
            });
        });
    });
}
exports.removeEntity = removeEntity;
