/// <reference path="../../typings/mongodb/mongodb.d.ts" />

// Module imports
import mongodb = require('mongodb');

// Module initialization
var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true})
var db = new mongodb.Db('test', server, {w: 1});
var readyDb: mongodb.Db = null;
db.open(function (err : Error, db : mongodb.Db) {
    if (err) {
        console.error('Error opening database connection: ' + err.message);
    }
    db.collection('entities', function (error, entities) {
        if (error) {
            console.error(error);
        }
        if (!entities) {
            db.createCollection('entities');
        }
        readyDb = db;
        console.log('connected database');
    });
});

/**
 * Gets the database connection.
 * @returns {"mongodb".Db}
 */
export function getDatabaseConnection(): mongodb.Db {
    return readyDb;
}
