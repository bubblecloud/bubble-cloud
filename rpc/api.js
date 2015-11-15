function subtract(x, y) {
    return new Promise(function (resolve, reject) {
        return resolve(x - y);
    });
}
function getRpcApiMethods() {
    return { 'subtract': subtract };
}
exports.getRpcApiMethods = getRpcApiMethods;
