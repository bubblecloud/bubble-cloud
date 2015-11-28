var Console = (function () {
    function Console() {
        this.firstName = 'John';
        this.lastName = 'Doe';
    }
    Console.prototype.sayHello = function () {
        alert("Hello " + this.firstName + " " + this.lastName + ". Nice to meet you.");
    };
    return Console;
})();
exports.Console = Console;
