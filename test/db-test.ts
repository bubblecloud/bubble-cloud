/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

/**
 * Module dependencies.
 */
import chai = require('chai');

var app = require('../app.js');

import db = require('../storage/dao');
import model = require('../storage/model');
import Entity = model.Entity;

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
            db.insertEntity(entity).then(function(inserted: Entity) {
                if (inserted == null) {
                    done("No entity returned.");
                }
                done();
            }).catch(function(error: Error) {
                console.error(error);
                done(error);
            });
        });
        it('should get entity', (done) => {
            db.getEntity(entity._id).then(function(result: Entity) {
                if (result == null) {
                    done("No entity returned.");
                }
                done();
            }).catch(function(error: Error) {
                console.error(error);
                done(error);
            });
        });
        it('should get entities', (done) => {
            db.getEntities().then(function(result: Entity[]) {
                if (result.length == 0) {
                    done("Entity not found.");
                }
                done();
            }).catch(function(error: Error) {
                console.error(error);
                done(error);
            });
        });
        it('should delete entity', (done) => {
            db.removeEntity(entity._id).then(function(result: Entity) {
                if (result == null) {
                    done("No entity returned.");
                }
                done();
            }).catch(function(error: Error) {
                console.error(error);
                done(error);
            });
        });
        it('should not get entities', (done) => {
            db.getEntities().then(function(result: Entity[]) {
                if (result.length != 0) {
                    done("Entity still found.");
                }
                done();
            }).catch(function(error: Error) {
                console.error(error);
                done(error);
            });
        });
    });
});