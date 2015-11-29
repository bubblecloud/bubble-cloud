/// <reference path="../../typings/mongodb/mongodb.d.ts" />
var es6_promise_1 = require('es6-promise');
var database = require('./Database');
var UserDao = (function () {
    function UserDao() {
    }
    UserDao.prototype.getUsers = function () {
        return new es6_promise_1.Promise(function (resolve, reject) {
            database.getDatabase().then(function (db) {
                db.collection('users', function (error, users) {
                    if (error) {
                        return reject(error);
                    }
                    users.find().toArray(function (error, users) {
                        if (error) {
                            return reject(error);
                        }
                        console.log('users db get all:' + users.length);
                        return resolve(users);
                    });
                });
            }).catch(function (error) {
                return reject(error);
            });
        });
    };
    return UserDao;
})();
exports.UserDao = UserDao;
