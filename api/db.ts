/// <reference path="../typings/mongodb/mongodb.d.ts" />

// Module imports
import dbConnection = require('../api/db-connection');
import {Promise} from 'es6-promise';

// Module initialization
var db = dbConnection.getDatabaseConnection();

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

export function insertEntity(entity: Entity) : Promise<Entity> {
    return new Promise<Entity>( function (resolve, reject) {

        db.collection('entities', function (error, entities) {
            if(error) { return reject(error); }

            entities.insertOne(entity, function (error, inserted) {
                if(error) { return reject(error); }
                return resolve(inserted);
            });
        });

    });
}

export function getEntity(id: string) : Promise<Entity> {
    return new Promise<Entity>( function (resolve, reject) {

        db.collection('entities', function(error, entities) {
            if(error) { return reject(error); }

            entities.findOne({_id: id}, function(error, foundEntity) {
                if(error) { return reject(error); }
                return resolve(foundEntity);
            });
        });

    });
}

export function getEntities() : Promise<Entity[]> {
    return new Promise<Entity[]>( function (resolve, reject) {
        db.collection('entities', function (error, entities) {
            if(error) { return reject(error); }

            entities.find().toArray(function (error, entities) {
                if(error) { return reject(error); }
                return resolve(entities);
            });
        });
    });
}

export function removeEntity(id: string) : Promise<Entity> {
    return new Promise<Entity>( function (resolve, reject) {
        db.collection('entities', function (error, entities) {
            if(error) { return reject(error); }

            entities.deleteOne({_id: id}, function (error, deletedEntity) {
                if(error) { return reject(error); }

                resolve(deletedEntity);
            });
        });
    });
}
