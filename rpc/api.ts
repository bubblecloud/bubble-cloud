function subtract(x: number, y: number): Promise<number> {
    return new Promise<number>( function (resolve, reject) {
        return resolve(x - y);
    });
}

export function getRpcApiMethods() {
    return {'subtract':subtract};
}