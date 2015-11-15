/// <reference path="../../typings/mongodb/mongodb.d.ts" />
var mongodb = require('mongodb');
var server = new mongodb.Server('localhost', 27017, { auto_reconnect: true });
var db = new mongodb.Db('test', server, { w: 1 });
db.open(function () {
});
db.collection('entities', function (error, entities) {
    if (error) {
        console.error(error);
    }
    if (!entities) {
        db.createCollection('entities');
    }
});
function getDatabaseConnection() {
    return db;
}
exports.getDatabaseConnection = getDatabaseConnection;
