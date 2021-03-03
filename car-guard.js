"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var httpEndpoints = {};
var protectedMethods = [];
function registerEndpoint(constructor) {
    var className = constructor.name;
    var endpointPath = "/" + className.toLowerCase();
    httpEndpoints[endpointPath] = new constructor();
}
function protect(target, propertyKey, descriptor) {
    var className = target.constructor.name;
    protectedMethods.push(className + "." + propertyKey);
}
function nope(target, propertyKey, descriptor) {
    descriptor.value = function () {
        console.log("nope");
    };
    return descriptor;
}
var Cars = /** @class */ (function () {
    function Cars() {
        this.makes = ["Acura", "Toyota", "Ferrari"];
    }
    Cars.prototype.get = function () {
        return this.makes;
    };
    Cars.prototype.post = function (req) {
        this.makes.push(req.body);
    };
    __decorate([
        nope
    ], Cars.prototype, "get", null);
    __decorate([
        protect
    ], Cars.prototype, "post", null);
    Cars = __decorate([
        registerEndpoint
    ], Cars);
    return Cars;
}());
console.log(httpEndpoints);
httpEndpoints["/cars"].get(); // ["Acura", "Toyota"]
// (/cars)
