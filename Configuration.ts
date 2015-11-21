export function getConfiguration() : {[key: string]: any} {
    return {
        'port': '3001',
        'remoteServers': [
            { 'url': 'http://127.0.0.1:3000/', 'x':0, 'y':0, 'z':3 }
        ],
        'databaseUrl': process.env.MONGODB || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test'
    };
}