import express, { json } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import _ from "lodash";
import jwt from "jsonwebtoken";
// import * as bcrypt from "bcrypt";

const app = express();
const jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);

app.listen(4000, () => {
  console.log("My server listening on port 4000");
});

const accessTokenSecret = "somesecret";

const randomFacts = [
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

function getDay(dayNum: number) {
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

interface IUser {
  name: string;
  username: string;
  password: string;
}

const users: IUser[] = [
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

app.get("/", (req: any, res: any) => {
  res.send("Hello from Daniel's server!");
});

app.get("/morning", (req: any, res: any) => {
  let name = req.query.name;
  const d = new Date();
  if (req.query.name) {
    res.send(`Good morning ${name}. Happy ${getDay(d.getDay())}`);
  } else {
    res.send("Good morning..... Sorry I dont think I got your name");
  }
});

app.get("/afternoon", (req: any, res: any) => {
  res.send(`Hey! How's your day been today?`);
});

app.post("/user/register", jsonParser, (req: any, res: any) => {
  console.log(req.body.username);
  const jsonInfo = req.body;
  const someUser = _.find(users, { username: jsonInfo.username });
  console.log(someUser);
  if (someUser) {
    return res.send("Sorry. Username is already taken try a different one");
  }
  if (jsonInfo.username && jsonInfo.name && jsonInfo.password) {
    users.push(jsonInfo);
    console.log(users);
    res.send("Account created");
  } else {
    res.send("Seems like your're missing some info");
  }
});

app.post("/user/login", (req: any, res: any) => {
  const { username, password } = req.body;

  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user) {
    const accessToken = jwt.sign(
      { username: user.username, name: user.name },
      accessTokenSecret
    );

    res.json({
      accessToken,
    });
  } else {
    res.send("Username or password incorrect");
  }
});

app.post("/secretInfo", (req: any, res: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      if (err) {
        res.send("You arent authorized to access this information");
        // return res.sendStatus(403);
      }
      //   res.send("Authenticated");
      const randNum = Math.floor(Math.random() * (randomFacts.length - 1));
      res.send({ userInfo: user, msg: randomFacts[randNum] });
    });
  } else {
    res.send("You arent authorized to access this information");
    // res.sendStatus(401);
  }
});
