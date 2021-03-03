"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
// import * as bcrypt from "bcrypt";
var app = express_1.default();
var jsonParser = body_parser_1.default.json();
var urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
app.use(jsonParser);
var httpEndpoints = {};
var protectedMethods = [];
function registerEndpoint(constructor) {
    var className = constructor.name;
    var endpointPath = "/" + className.toLowerCase();
    httpEndpoints[endpointPath] = new constructor();
}
function protect(target, propertyKey, descriptor) {
    var originalFunction = descriptor.value;
    descriptor.value = function (request) {
        if (request.token !== "123") {
            // throw new Error("forbiden!");
            console.log("Forbidden");
        }
        var bindedOriginalFunction = originalFunction.bind(this);
        var result = bindedOriginalFunction(request);
        return result;
    };
    return descriptor;
}
function nope(target, propertyKey, descriptor) {
    descriptor.value = function () {
        console.log("nope");
    };
    return descriptor;
}
// @registerEndpoint
var Cars = /** @class */ (function () {
    function Cars() {
        this.makes = ["Acura", "Toyota", "Ferrari"];
    }
    Cars.prototype.get = function () {
        return this.makes;
    };
    Cars.prototype.post = function (req) {
        this.makes.push(req.body);
        console.log(this.makes);
    };
    __decorate([
        protect
    ], Cars.prototype, "post", null);
    return Cars;
}());
app.listen(4000, function () {
    console.log("My server listening on port 4000");
});
app.get("/cars", jsonParser, function (req, res) {
    // console.log("hello world");
    // console.log(req.body);
    // const a = httpEndpoints["/cars"].get();
    var c = new Cars();
    var a = c.get();
    // const b = c.post("Apple");
    // console.log(a);
    res.send(a);
});
