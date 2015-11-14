/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/**
 * Module dependencies.
 */
var chai = require('chai');
var app = require('../app.js');
var db = require('../api/db');
var Entity = db.Entity;
/**
 * Globals
 */
var expect = chai.expect;
/**
 * Unit tests
 */
describe('Entity Model Unit Tests:', function () {
    describe('test persistence', function () {
        var entity = new Entity();
        it('should insert entity', function (done) {
            db.insertEntity(entity, function (error, insertedEntity) {
                if (error) {
                    console.error(error);
                    return done(error);
                }
                done();
            });
        });
        it('should get entity', function (done) {
            db.getEntity(entity._id, function (error, gottenEntity) {
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
        it('should get entities', function (done) {
            db.getEntities(entity._id, function (error, entities) {
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
        it('should delete entity', function (done) {
            db.removeEntity(entity._id, function (error, removedEntity) {
                if (error) {
                    console.error(error);
                    return done(error);
                }
                done();
            });
        });
        it('should not get entities', function (done) {
            db.getEntities(entity._id, function (error, entities) {
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
//# sourceMappingURL=db-test.js.map