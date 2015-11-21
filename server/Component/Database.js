/// <reference path="../../typings/mongodb/mongodb.d.ts" />
var mongodb = require('mongodb');
var server = new mongodb.Server('localhost', 27017, { auto_reconnect: true });
var db = new mongodb.Db('test', server, { w: 1 });
var readyDb = null;
db.open(function (err, db) {
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
function getDatabaseConnection() {
    return readyDb;
}
exports.getDatabaseConnection = getDatabaseConnection;
