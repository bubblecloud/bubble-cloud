/// <reference path="../../typings/mongodb/mongodb.d.ts" />

// Module imports
import mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

// Module initialization
//var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true})
//var db = new mongodb.Db('test', server, {w: 1});
var database: mongodb.Db = null;

/**
 * Gets the database connection.
 * @returns {"mongodb".Db}
 */
export function getDatabase() : Promise<mongodb.Db> {
    return new Promise<mongodb.Db>(function (resolve, reject) {
        if (database) {
            return resolve(database);
        } else {
            MongoClient.connect('mongodb://127.0.0.1:27017/test', function(error, db) {
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
