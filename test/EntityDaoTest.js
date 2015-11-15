/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
var chai = require('chai');
var app = require('../app.js');
var db = require('../storage/dao');
var model = require('../storage/model');
var Entity = model.Entity;
var should = chai.should();
var expect = chai.expect;
describe('Entity Model Unit Tests:', function () {
    describe('test persistence', function () {
        var entity = new Entity();
        it('should insert entity', function (done) {
            db.insertEntity(entity).then(function (inserted) {
                if (inserted == null) {
                    done("No entity returned.");
                }
                done();
            }).catch(function (error) {
                console.error(error);
                done(error);
            });
        });
        it('should get entity', function (done) {
            db.getEntity(entity._id).then(function (result) {
                if (result == null) {
                    done("No entity returned.");
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
                    done("Entity not found.");
                }
                done();
            }).catch(function (error) {
                console.error(error);
                done(error);
            });
        });
        it('should delete entity', function (done) {
            db.removeEntity(entity._id).then(function (result) {
                if (result == null) {
                    done("No entity returned.");
                }
                done();
            }).catch(function (error) {
                console.error(error);
                done(error);
            });
        });
        it('should not get entities', function (done) {
            db.getEntities().then(function (result) {
                if (result.length != 0) {
                    done("Entity still found.");
                }
                done();
            }).catch(function (error) {
                console.error(error);
                done(error);
            });
        });
    });
});
