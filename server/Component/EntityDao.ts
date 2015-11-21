/// <reference path="../../typings/mongodb/mongodb.d.ts" />

// Module imports
import {Promise} from 'es6-promise';
import database = require('./Database');
import model = require('./ServerEntity');
import Entity = model.ServerEntity;

/**
 * Insert entity to database.
 * @param entity the entity
 * @returns {Promise<ServerEntity>}
 */
export function insertEntity(entity: Entity) : Promise<Entity> {
    console.log('entity db insert:' + entity.id);
    return new Promise<Entity>( function (resolve, reject) {
        var db = database.getDatabaseConnection();
        db.collection('entities', function (error, entities) {
            if(error) {
                console.error('entity insert error: ' + error.message);
                return reject(error);
            }

            entities.insertOne(entity, function (error, inserted) {
                if(error) {
                    console.error('entity insert error: ' + error.message);
                    return reject(error);
                }
                return resolve(inserted);
            });
        });

    });
}

/**
 * Update entity to database.
 * @param entity the entity
 * @returns {Promise<ServerEntity>}
 */
export function updateEntity(entity: Entity) : Promise<Entity> {
    console.log('entity db update:' + entity.id);
    return new Promise<Entity>( function (resolve, reject) {
        var db = database.getDatabaseConnection();
        db.collection('entities', function (error, entities) {
            if(error) { return reject(error); }

            entities.updateOne({id: entity.id}, entity, function (error, inserted) {
                if(error) { return reject(error); }
                return resolve(inserted);
            });
        });

    });
}

/**
 * Gets entity from database or null if no entity was found.
 * @param id the ID of the entity
 * @returns {Promise<ServerEntity>}
 */
export function getEntity(id: string) : Promise<Entity> {
    console.log('entity db get:' + id);

    return new Promise<Entity>( function (resolve, reject) {
        var db = database.getDatabaseConnection();
        db.collection('entities', function(error, entities) {
            if(error) { return reject(error); }

            entities.findOne({id: id}, function(error, foundEntity) {
                if(error) { return reject(error); }
                return resolve(foundEntity);
            });
        });

    });
}

/**
 * Gets all entities from database.
 * @returns {Promise<ServerEntity[]>}
 */
export function getEntities() : Promise<Entity[]> {
    return new Promise<Entity[]>( function (resolve, reject) {
        var db = database.getDatabaseConnection();
        db.collection('entities', function (error, entities) {
            if(error) { return reject(error); }

            entities.find().toArray(function (error, entities) {
                if(error) { return reject(error); }
                return resolve(entities);
            });
        });
    });
}

/**
 * Removes entity from database
 * @param id the ID of the entity
 * @returns {Promise<ServerEntity>}
 */
export function removeEntity(id: string) : Promise<Entity> {
    console.log('entity db delete:' + id);
    return new Promise<Entity>( function (resolve, reject) {
        var db = database.getDatabaseConnection();
        db.collection('entities', function (error, entities) {
            if(error) { return reject(error); }

            entities.deleteOne({id: id}, function (error, deletedEntity) {
                if(error) { return reject(error); }

                resolve(deletedEntity);
            });
        });
    });
}
