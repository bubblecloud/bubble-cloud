/// <reference path="../../typings/mongodb/mongodb.d.ts" />
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var database = null;
function getDatabase() {
    return new Promise(function (resolve, reject) {
        if (database) {
            return resolve(database);
        }
        else {
            MongoClient.connect('mongodb://127.0.0.1:27017/test', function (error, db) {
                if (error) {
                    return reject(error);
                }
                db.collection('entities', function (error, entities) {
                    if (error) {
                        return reject(error);
                    }
                    if (!entities) {
                        db.createCollection('entities');
                    }
                    database = db;
                    resolve(database);
                });
            });
        }
    });
}
exports.getDatabase = getDatabase;
