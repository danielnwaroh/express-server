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
var fs_1 = __importDefault(require("fs"));
var app = express_1.default();
var jsonParser = body_parser_1.default.json();
var urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
var rawdata = fs_1.default.readFileSync("cars.json");
var cars = JSON.parse(rawdata.toString());
console.log(cars);
app.use(jsonParser);
var protectedMethods = [];
function protect(target, propertyKey, descriptor) {
    var originalFunction = descriptor.value;
    descriptor.value = function (request) {
        // console.log(request);
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
function checkBody(target, propertyKey, descriptor) {
    var originalFunction = descriptor.value;
    descriptor.value = function (request) {
        console.log(request.make);
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
        console.log(req);
        this.makes.push(req.name);
        return this.makes;
    };
    Cars.prototype.writeDB = function (dbFunc, data, dbName) {
        // console.log(dbName);
        // dbFunc(dbName, data);
    };
    __decorate([
        protect
    ], Cars.prototype, "post", null);
    __decorate([
        checkBody
    ], Cars.prototype, "writeDB", null);
    return Cars;
}());
var c = new Cars();
app.listen(4000, function () {
    console.log("My server listening on port 4000");
});
app.get("/cars", jsonParser, function (req, res) {
    var a = c.get();
    res.send(a);
});
app.post("/add-cars", jsonParser, function (req, res) {
    var a = c.post(req.body);
    res.send(a);
});
// Need to type check
app.post("/write-db", jsonParser, function (req, res) {
    var temp = cars;
    temp.push(req.body);
    c.writeDB(fs_1.default.writeFileSync, JSON.stringify(temp), "cars.json");
    res.send("Writing to DB");
});
