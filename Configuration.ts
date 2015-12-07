export function getConfiguration() : {[key: string]: any} {
    return {
        'port': '3001',
        'remoteServers': [
        ],
        'databaseUrl': process.env.MONGODB || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test'
    };
}