/// <reference path="../../typings/mongodb/mongodb.d.ts" />

// Module imports
import {Promise} from 'es6-promise';
import database = require('./Database');
import {User} from "./User";

export class UserDao {
    /**
     * Gets all entities from database.
     * @returns {Promise<ServerUser[]>}
     */
    getUsers():Promise<User[]> {
        return new Promise<User[]>(function (resolve, reject) {
            database.getDatabase().then((db) => {
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
            }).catch((error) => {
                return reject(error);
            })
        });
    }
}