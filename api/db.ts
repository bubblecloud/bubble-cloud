/// <reference path="../typings/mongodb/mongodb.d.ts" />

// Module imports
import {Promise} from 'es6-promise';
import dbConnection = require('../api/db-connection');
import model = require('../api/model');
import Entity = model.Entity;

// Module initialization
var db = dbConnection.getDatabaseConnection();

/**
 * Insert entity to database.
 * @param entity the entity
 * @returns {Promise<Entity>}
 */
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

/**
 * Gets entity from database or null if no entity was found.
 * @param id the ID of the entity
 * @returns {Promise<Entity>}
 */
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

/**
 * Gets all entities from database.
 * @returns {Promise<Entity[]>}
 */
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

/**
 * Removes entity from database
 * @param id the ID of the entity
 * @returns {Promise<Entity>}
 */
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
