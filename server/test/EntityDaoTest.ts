/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

/**
 * Module dependencies.
 */
import chai = require('chai');

var app = require('../../app.js');

import db = require('../Storage/EntityDao');
import model = require('../Storage/Entity');
import Entity = model.Entity;
var User = require('../Legacy/Models/User');

/**
 * Globals
 */

var should = chai.should();
var expect = chai.expect;

/**
 * Unit tests
 */
describe('Entity Model Unit Tests:', () => {

    describe('test persistence', () => {
        var entity: Entity = new Entity();
        entity.id = -1;
        it('should insert entity', (done) => {
            db.insertEntity(entity).then(function(inserted: Entity) {
                if (inserted == null) {
                    return done("No entity returned.");
                }
                done();
            }).catch(function(error: Error) {
                console.error(error);
                done(error);
            });
        });
        it('should get entity', (done) => {
            db.getEntity(entity.id).then(function(result: Entity) {
                if (result == null) {
                    return done("No entity returned.");
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
                    return done("Entity not found.");
                }
                done();
            }).catch(function(error: Error) {
                console.error(error);
                done(error);
            });
        });
        it('should delete entity', (done) => {
            db.removeEntity(entity.id).then(function(result: Entity) {
                if (result == null) {
                    return done("No entity returned.");
                }
                done();
            }).catch(function(error: Error) {
                console.error(error);
                done(error);
            });
        });
        it('should not get entity', (done) => {
            db.getEntity(entity.id).then(function(result: Entity) {
                if (result != null) {
                    return done("Entity still returned.");
                }
                done();
            }).catch(function(error: Error) {
                console.error(error);
                done(error);
            });
        });
    });
});