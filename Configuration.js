function getConfiguration() {
    return {
        'port': '3001',
        'remoteServers': [],
        'databaseUrl': process.env.MONGODB || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test'
    };
}
exports.getConfiguration = getConfiguration;
