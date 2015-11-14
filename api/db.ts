/// <reference path="../typings/mongodb/mongodb.d.ts" />
/// <reference path="../typings/babylonjs/babylonjs.d.ts" />

// Mongo
import mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true})
var db = new mongodb.Db('test', server, { w: 1 });
db.open(function() {});

db.collection('entities', function(error, entities) {
    if (error) {
        console.error(error);
    }
    if (!entities) {
        db.createCollection('entities');
    }
});

export class Vector3 {
    x:number = 0;
    y:number = 0;
    z:number = 0;
}

export class Quaternion {
    x:number = 0;
    y:number = 0;
    z:number = 0;
    w:number = 0;
}

export class Entity {
    _id: string;
    position: Vector3 = new Vector3();
    rotationQuaternion: Quaternion = new Quaternion();
    scaling: Vector3 = new Vector3();
}

export function insertEntity(entity: Entity, callback: (error: Error, entity: Entity) => void) {
    db.collection('entities', function(error, entities) {
        if(error) {
            console.error("Error:" + error);
            callback(error, null);
            return;
        }
        entities.insertOne(entity, function(error, insertedEntity) {
            if(error) {
                console.error("Error:" + error);
            }
            callback(error, insertedEntity);
        });
    });
}

export function getEntity(id: string, callback: (error: Error, entity: Entity) => void) {
    db.collection('entities', function(error, entities) {
        if(error) {
            console.error(error);
            callback(error, null);
        }
        entities.findOne({_id: id}, function(error, foundEntity) {
            if(error) { console.error(error);}
            callback(error, foundEntity);
        });
    });
}

export function getEntities(id: string, callback: (error: Error, entity: Entity[]) => void) {
    db.collection('entities', function(error, entities) {
        if(error) {
            console.error(error);
            callback(error, null);
        }
        entities.find({_id: id}).toArray(function(error, entities) {
            if(error) { console.error(error);}
            callback(error, entities);
        });
    });
}

export function removeEntity(id: string, callback: (error: Error, entity: Entity) => void) {
    db.collection('entities', function(error, entities) {
        if(error) { console.error(error); return; }
        entities.deleteOne({_id: id}, function(error, deletedEntity) {
            if(error) {
                console.error(error);
                callback(error, null);
            }
            callback(error, deletedEntity);
        });
    });
}
