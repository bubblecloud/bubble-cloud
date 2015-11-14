/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

/**
 * Module dependencies.
 */
import chai = require('chai');

var app = require('../app.js');

import db = require('../api/db');
import Entity = db.Entity;

/**
 * Globals
 */

var expect = chai.expect;

/**
 * Unit tests
 */
describe('Entity Model Unit Tests:', () => {

    describe('test persistence', () => {
        var entity: Entity = new Entity();

        it('should insert entity', (done) => {
            db.insertEntity(entity, function(error, insertedEntity) {
                if (error) {
                    console.error(error);
                    return done(error);
                }
                done();
            });
        });
        it('should get entity', (done) => {
            db.getEntity(entity._id, function(error, gottenEntity) {
                if (error) {
                    console.error(error);
                    return done(error);
                }
                if (gottenEntity == null) {
                    done("No entity found.");
                }
                done();
            });
        });
        it('should get entities', (done) => {
            db.getEntities(entity._id, function(error, entities) {
                if (error) {
                    console.error(error);
                    return done(error);
                }
                if (entities.length == 0) {
                    done("Entity not found.");
                }
                done();
            });
        });
        it('should delete entity', (done) => {
            db.removeEntity(entity._id, function(error, removedEntity) {
                if (error) {
                    console.error(error);
                    return done(error);
                }
                done();
            });
        });
        it('should not get entities', (done) => {
            db.getEntities(entity._id, function(error, entities) {
                if (error) {
                    console.error(error);
                    return done(error);
                }
                if (entities.length != 0) {
                    done("Entities found.");
                }
                done();
            });
        });
    });
});