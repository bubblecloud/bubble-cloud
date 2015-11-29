import {ServerEngine} from "../Component/ServerEngine";
import {UserDao} from "../Component/UserDao";

export class ServerRpcApi {
    serverEngine: ServerEngine;

    constructor(serverEngine: ServerEngine) {
        this.serverEngine = serverEngine;
    }

    subtract(x:number, y:number):Promise<number> {
        return new Promise<number>(function (resolve, reject) {
            return resolve(x - y);
        });
    }

    listUsers():Promise<{[key: string]: string}> {
        return new Promise<{[key: string]: string}>(function (resolve, reject) {
            console.log('listing users.');
            var userDao = new UserDao();
            userDao.getUsers().then((users) => {
                var idEmailMap:{[key: string]: string} = {};
                for (var user of users) {
                    idEmailMap[user._id] = user.email;
                }
                resolve(idEmailMap);
            }).catch((error) => {
                console.log('Error listing users:' + error);
                reject(error);
            });
            /*console.log('listing users: ' + User);
            for (var key in User.find) {
                console.log(key);
            }
            try {
                User.find({}, function (err, users) {
                    if (err) {
                        console.log('Error listing users:' + err);
                        return reject(err);
                    }
                    console.log('listed users: ' + users);
                    var idEmailMap:{[key: string]: string} = {};
                    users.forEach(function (user) {
                        idEmailMap[user._id] = user.email;
                    });
                    resolve(idEmailMap);
                });
            } catch (error) {
                console.log('Error listing users:' + error);
                reject(error);
            }*/
        });
    };

    getRpcApiMethods() {
        return {
            'subtract': this.subtract,

            'listUsers': () => {
                return this.listUsers();
            }
        };
    }
}

