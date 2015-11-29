/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
var chai = require('chai');
var app = require('../../app.js');
var db = require('../Component/EntityDao');
var model = require('../Component/ServerEntity');
var Entity = model.ServerEntity;
var should = chai.should();
var expect = chai.expect;
describe('Entity Model Unit Tests:', function () {
    describe('test persistence', function () {
        var entity = new Entity();
        entity.id = '' + (-1);
        it('should insert entity', function (done) {
            db.insertEntity(entity).then(function (inserted) {
                if (inserted == null) {
                    return done("No entity returned.");
                }
                done();
            }).catch(function (error) {
                console.error(error);
                done(error);
            });
        });
        it('should get entity', function (done) {
            db.getEntity(entity.id).then(function (result) {
                if (result == null) {
                    return done("No entity returned.");
                }
                done();
            }).catch(function (error) {
                console.error(error);
                done(error);
            });
        });
        it('should get entities', function (done) {
            db.getEntities().then(function (result) {
                if (result.length == 0) {
                    return done("Entity not found.");
                }
                done();
            }).catch(function (error) {
                console.error(error);
                done(error);
            });
        });
        it('should delete entity', function (done) {
            db.removeEntity(entity.id).then(function (result) {
                if (result == null) {
                    return done("No entity returned.");
                }
                done();
            }).catch(function (error) {
                console.error(error);
                done(error);
            });
        });
        it('should not get entity', function (done) {
            db.getEntity(entity.id).then(function (result) {
                if (result != null) {
                    return done("Entity still returned.");
                }
                done();
            }).catch(function (error) {
                console.error(error);
                done(error);
            });
        });
    });
});
