"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var lodash_1 = __importDefault(require("lodash"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import * as bcrypt from "bcrypt";
var app = express_1.default();
var jsonParser = body_parser_1.default.json();
var urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
app.use(jsonParser);
app.listen(4000, function () {
    console.log("My server listening on port 4000");
});
var accessTokenSecret = "somesecret";
var randomFacts = [
    "The Atlantic Ocean is saltier than the Pacific Ocean",
    "About twenty-five percent of the population sneeze when they are exposed to light.",
    "A quarter has 119 grooves on its edge, a dime has one less groove!",
    "The worlds oldest piece of chewing gum is over 9000 years old!",
    "Natural gas has no smell. The odor is artificially added so that people will be able to identify leaks and take measures to stop them.",
    "An earthquake on Dec. 16, 1811 caused parts of the Mississippi River to flow backwards.",
    "More people have a phobia of frogs than rats.",
    "The song 'Strawberry Fields Forever', sung by the Beatles, refers to an orphanage located in Liverpool.",
    "There is a town called Paradise and a town called Hell in Michigan!",
];
function getDay(dayNum) {
    switch (dayNum) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "Hmm, actually not sure what day it is";
    }
}
var users = [
    {
        name: "Daniel",
        username: "dantheman",
        password: "dan123",
    },
    {
        name: "John",
        username: "johnny0",
        password: "123",
    },
];
app.get("/", function (req, res) {
    res.send("Hello from Daniel's server!");
});
app.get("/morning", function (req, res) {
    var name = req.query.name;
    var d = new Date();
    if (req.query.name) {
        res.send("Good morning " + name + ". Happy " + getDay(d.getDay()));
    }
    else {
        res.send("Good morning..... Sorry I dont think I got your name");
    }
});
app.get("/afternoon", function (req, res) {
    res.send("Hey! How's your day been today?");
});
app.post("/user/register", jsonParser, function (req, res) {
    console.log(req.body.username);
    var jsonInfo = req.body;
    var someUser = lodash_1.default.find(users, { username: jsonInfo.username });
    console.log(someUser);
    if (someUser) {
        return res.send("Sorry. Username is already taken try a different one");
    }
    if (jsonInfo.username && jsonInfo.name && jsonInfo.password) {
        users.push(jsonInfo);
        console.log(users);
        res.send("Account created");
    }
    else {
        res.send("Seems like your're missing some info");
    }
});
app.post("/user/login", function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password;
    var user = users.find(function (u) {
        return u.username === username && u.password === password;
    });
    if (user) {
        var accessToken = jsonwebtoken_1.default.sign({ username: user.username, name: user.name }, accessTokenSecret);
        res.json({
            accessToken: accessToken,
        });
    }
    else {
        res.send("Username or password incorrect");
    }
});
app.post("/secretInfo", function (req, res) {
    var authHeader = req.headers.authorization;
    if (authHeader) {
        var token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, accessTokenSecret, function (err, user) {
            if (err) {
                res.send("You arent authorized to access this information");
                // return res.sendStatus(403);
            }
            //   res.send("Authenticated");
            var randNum = Math.floor(Math.random() * (randomFacts.length - 1));
            res.send({ userInfo: user, msg: randomFacts[randNum] });
        });
    }
    else {
        res.send("You arent authorized to access this information");
        // res.sendStatus(401);
    }
});
