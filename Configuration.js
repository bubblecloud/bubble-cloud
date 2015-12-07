function getConfiguration() {
    return {
        'port': '3000',
        'remoteServers': [
            { 'url': 'http://127.0.0.1:3001/', 'x': 8, 'y': -5, 'z': -15 }
        ],
        'databaseUrl': process.env.MONGODB || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test'
    };
}
exports.getConfiguration = getConfiguration;
