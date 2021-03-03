import express, { json, Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import _ from "lodash";
import jwt from "jsonwebtoken";
// import * as bcrypt from "bcrypt";

const app = express();
const jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);

const httpEndpoints: any = {};

const protectedMethods = [];

function registerEndpoint(constructor: any) {
  const className = constructor.name;
  const endpointPath = "/" + className.toLowerCase();
  httpEndpoints[endpointPath] = new constructor();
}

function protect(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalFunction = descriptor.value;

  descriptor.value = function (request: any) {
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

function nope(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  descriptor.value = function () {
    console.log("nope");
  };
  return descriptor;
}

// @registerEndpoint
class Cars {
  private makes = ["Acura", "Toyota", "Ferrari"];

  get() {
    return this.makes;
  }

  @protect
  post(req: any) {
    this.makes.push(req.body);
    console.log(this.makes);
  }
}

app.listen(4000, () => {
  console.log("My server listening on port 4000");
});

app.get("/cars", jsonParser, (req: any, res: any) => {
  // console.log("hello world");
  // console.log(req.body);
  // const a = httpEndpoints["/cars"].get();
  const c = new Cars();
  const a = c.get();
  // const b = c.post("Apple");
  // console.log(a);
  res.send(a);
});
