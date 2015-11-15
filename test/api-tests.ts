/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

/**
 * Module dependencies.
 */
import chai = require('chai');

var request = require('supertest');
var app = require('../app.js');
var User = require('../models/User');

import model = require('../storage/model');
import Entity = model.Entity;

/**
 * Globals
 */

var expect = chai.expect;

/**
 * Unit tests
 */
describe('API Unit Tests:', () => {

    it('should create a new user', function(done) {
        var user = new User({
            email: 'test@gmail.com',
            password: 'password'
        });
        user.save(function(err) {
            if (err) return done(err);
            done();
        })
    });

    it('should login user', function(done) {
        var agent = request.agent(app);
        agent
            .get('/login')
            .expect(200)
            .end(function(err, res){
                if (err) { return done(err);}
                var csrfToken = parseBetween("name=\"_csrf\" value=\"", "\"",res.res.text);
                console.log('CSRF TOKEN:"' + csrfToken + '"');
                agent
                    .post('/login')
                    .set("x-csrf-token", csrfToken)
                    .field('email', 'test@gmail.com')
                    .field('password', 'password')
                    .expect(302)
                    .end(function(err, res){
                        if (err) { return done(err);}
                        console.log(res);
                        done();
                    });
            });

    });

    /*it('should return 404', function(done) {
        request(app)
            .get('/').expect(200);
        request(app)
            .post('/rpc')
            .expect(404, done);
    });*/

    it('should delete a user', function(done) {
        User.remove({ email: 'test@gmail.com' }, function(err) {
            if (err) return done(err);
            done();
        });
    });
});

function parseBetween(firstTag, secondTag, value) {
    var firstTagBegin = value.indexOf(firstTag);
    var firstTagLength = firstTag.length;
    var firstTagEnd = firstTagBegin + firstTagLength;
    var secondTagBegin = value.indexOf(secondTag, firstTagEnd);
    return value.substring(firstTagEnd, secondTagBegin);
}