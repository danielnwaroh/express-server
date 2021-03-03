import express, { json, Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import _ from "lodash";
import jwt from "jsonwebtoken";
// import * as bcrypt from "bcrypt";
import fs from "fs";

const app = express();
const jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

let rawdata = fs.readFileSync("cars.json");
let cars: any[] = JSON.parse(rawdata.toString());
console.log(cars);

app.use(jsonParser);

const protectedMethods = [];

function protect(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalFunction = descriptor.value;

  descriptor.value = function (request: any) {
    // console.log(request);
    if (request.token !== "123") {
      // throw new Error("forbiden!");
      console.log("Forbidden");
    }
    const bindedOriginalFunction = originalFunction.bind(this);
    const result = bindedOriginalFunction(request);
    return result;
  };

  return descriptor;
}

// TODO: Type check
function checkBody(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalFunction = descriptor.value;
  // console.log(descriptor.value[2]);
  descriptor.value = function (request: any) {
    console.log(request);
  };
  return descriptor;
}

class Cars {
  private makes = ["Acura", "Toyota", "Ferrari"];

  get() {
    return this.makes;
  }

  @protect
  post(req: any) {
    console.log(req);
    this.makes.push(req.name);
    return this.makes;
  }

  @checkBody
  writeDB(dbFunc: any, data: string, dbName: string) {
    // console.log(dbName);
    // dbFunc(dbName, data);
  }
}
const c = new Cars();
app.listen(4000, () => {
  console.log("My server listening on port 4000");
});

app.get("/cars", jsonParser, (req: any, res: any) => {
  const a = c.get();
  res.send(a);
});

app.post("/add-cars", jsonParser, (req: any, res: any) => {
  const a = c.post(req.body);
  res.send(a);
});

// Need to type check
app.post("/write-db", jsonParser, (req: any, res: any) => {
  let temp = cars;
  temp.push(req.body);
  c.writeDB(fs.writeFileSync, JSON.stringify(temp), "cars.json");
  res.send("Writing to DB");
});
