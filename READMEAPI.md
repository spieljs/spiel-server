# Spiel Server
[![Travis CI](https://travis-ci.org/spieljs/spiel-server.svg?branch=master)](https://travis-ci.org/spieljs/spiel-server)
[![npm](https://img.shields.io/npm/v/spiel-server.svg)](https://www.npmjs.org/package/spiel-server)

Spiel server is a middleware framework to make easy create backend applications.
* You can create easily endpoints with decorators and make more logic your code.
* Spiel server creates automatically a root endpoint which response with all the endpoints and its methods of the backend application.
* It uses [Roads](https://github.com/Dashron/roads) as core which make possible to attach the middlewares in HTTP servers like Koa.js, Express.js or use [roads-server](https://github.com/Dashron/roads-server) which is also integrate.

## How use it
### Create your endpoints
```typescript
import {Endpoint, Get, IUrl, Road, SetRouter} from "spiel-server";

@Endpoint("user")
class User {
    private body;

    @Before(info)
    @Get("")
    public getUsers() {
        return new Response(users, 200);
    }

    @Post("")
    public addUser(url: IUrl) {
        const user = this.body;
        users.push(user);
        return new Response(users, 200);
    }
}
```
Notice that you will have the body request already parsed in `this.body`
if you want the body without parse (string) then you have to past body by argument like this:
```typescript
@Endpoint("user")
class User {
    private body: any;

    @Post("")
    public addUser(url: IUrl, body) {
        console.log(body);
        const user = this.body;
        users.push(user);
        return new Response(users, 200);
    }
}
```

### Create your middlewares
```typescript
import {After, AfterAll, Before, BeforeAll, Delete, Endpoint, Get, HttpError,
    IRouterOptions, IUrl, middleware, Post, Put, Response,
    Road, Server, SetRouter} from "../src";
import {users} from "./assets";

const info = (method: string, path: string, body: any, headers: Headers, next: () => any) => {
    console.log(`A ${method} request was made to ${JSON.stringify(path)}`);
    return next();
};

const infoAll = (method: string, path: string, body: any, headers: Headers, next: () => any) => {
    console.log("The middleware start");
    return next();
};

const changeResponse = (method: string, path: string, body: any, headers: Headers, next: () => any) => {
    console.log("End");
    return next();
};

const finish = (method: string, path: string, body: any, headers: Headers, next: () => any) => {
    console.log("Finish");
    return new Response({greet: "Bye"}, 200);
};

@BeforeAll(infoAll)
@Endpoint()
class User {
    private body: any;

    @Before(info)
    @Get("", {name: "user", secret})
    public getUsers() {
        return new Response(users, 200);
    }
    @Get("#id")
    public getUser(url: IUrl) {
        const id = url.args.id;
        const user: any = users.find((elment) => elment.id === id);
        return new Response(user, 200);
    }

    @Post("", {name: "admin", secret})
    public addUser(url: IUrl) {
        const user = this.body;
        users.push(user);
        return new Response(users, 200);
    }

    @Put("#id", {name: "admin", secret})
    public updateUser(url: IUrl) {
        const id = url.args.id;
        const resp = users.map((user) => {
            const value = user;
            if (value.id === id) {
                value.permission = this.body.permission;
            }
            return value;
        });
        if (!resp) {
            return new HttpError("User not found", 404);
        } else {
            return new Response(resp, 200);
        }
    }

    @Delete("#id", {name: "admin", secret})
    public deleteUser(url: IUrl) {
        const id = url.args.id;
        const index = users.findIndex((user: any) => user.id === id);
        users.splice(index, 1);
        return new Response(users, 200);
    }
}

@Endpoint()
@AfterAll(finish)
class Greeting {
    @After(changeResponse)
    @Get("")
    public getGreeting(url: IUrl, body: any, headers: Headers, next: () => {}) {
        console.log("HELLO EVERYBODY");
        return next();
    }
}

@Endpoint()
class OtherClass {
    @Get("$name")
    public getName(url: IUrl, body: any, headers: Headers, next: () => {}) {
        return new Response(url.args, 200);
    }
}
```
Since the versoin 1.0 you don't need to write any path logic just put before/beforeAll/after/afterAll when you want the middleware execution.

### Setting the router
```typescript

const endpoints = [new User(), [new Greeting(), new OtherClass()]];

const cors = {
    validOrigins: ['http://localhost:8080'],
    responseHeaders: ['content-type']
};

const configRouter: IRouterOptions = {
  connectionMode: true,
  cors,
  endpoints,
  road: app,
  verbose: true,
};

new SetRouter(configRouter);
```
Notice that you can group the routers allowing more flexible project structure

### Using the roads API
```typescript
import {Road, middleware} from "spiel-server";

const app = new Road();

app.use(middleware.cors({
    validOrigins: ['http://localhost:8080'],
    responseHeaders: ['content-type']
}));
```
About the Roads Api see [in Roads docs](https://github.com/Dashron/roads#index)

### AuthConnection
If you use spiel-connect you can send the head `authconnection` with the token of permission array
as value and Spiel Server only will response with the method that match with the permission sent.
Example:

Send the token:
```typescript
const permissions = ["admin", "user"];
secret = "7983ac7ab1f7f706a962f6679bbdaae9ede06519c75e1ae7f1f92f3474eae21d";
const token = jwt.encode(permissions, secret);
headers = {authconnection : token};
```

Add permission to method
```typescript
@Endpoint()
class OtherClass {
    @Get("$name", {name: "admin", secret})
    public getName(url: IUrl, body: any, headers: Headers, next: () => {}) {
        return new Response(url.args, 200);
    }
}
```

Set authConnection and connectionMode true in router options
```typescript
const configRouter: IRouterOptions = {
  authConnection: true,
  connectionMode: true,
  endpoints,
  road: app,
  verbose: true,
};

new SetRouter(configRouter);
```

### Complete example with Server
```typescript
import {After, AfterAll, Before, BeforeAll, Delete, Endpoint, Get, HttpError,
    IRouterOptions, IUrl, middleware, Post, Put, Response,
    Road, Server, SetRouter} from "../src";
import {users} from "./assets";

const app = new Road();
const secret = "7983ac7ab1f7f706a962f6679bbdaae9ede06519c75e1ae7f1f92f3474eae21d";

const server = new Server(app, (error: any) => {
    switch (error.code) {
        case 404:
            return new Response("Not Found", 404);
        case 405:
            return new Response("Not Allowed", 405);
        default:
        case 500:
            return new Response(error.message, 500);
    }
});

const info = (method: string, path: string, body: any, headers: Headers, next: () => any) => {
    console.log(`A ${method} request was made to ${JSON.stringify(path)}`);
    return next();
};

const infoAll = (method: string, path: string, body: any, headers: Headers, next: () => any) => {
    console.log("The middleware start");
    return next();
};

const changeResponse = (method: string, path: string, body: any, headers: Headers, next: () => any) => {
    console.log("End");
    return next();
};

const finish = (method: string, path: string, body: any, headers: Headers, next: () => any) => {
    console.log("Finish");
    return new Response({greet: "Bye"}, 200);
};

@BeforeAll(infoAll)
@Endpoint()
class User {
    private body: any;

    @Before(info)
    @Get("", {name: "user", secret})
    public getUsers() {
        return new Response(users, 200);
    }
    @Get("#id")
    public getUser(url: IUrl) {
        const id = url.args.id;
        const user: any = users.find((elment) => elment.id === id);
        return new Response(user, 200);
    }

    @Post("", {name: "admin", secret})
    public addUser(url: IUrl) {
        const user = this.body;
        users.push(user);
        return new Response(users, 200);
    }

    @Put("#id", {name: "admin", secret})
    public updateUser(url: IUrl) {
        const id = url.args.id;
        const resp = users.map((user) => {
            const value = user;
            if (value.id === id) {
                value.permission = this.body.permission;
            }
            return value;
        });
        if (!resp) {
            return new HttpError("User not found", 404);
        } else {
            return new Response(resp, 200);
        }
    }

    @Delete("#id", {name: "admin", secret})
    public deleteUser(url: IUrl) {
        const id = url.args.id;
        const index = users.findIndex((user: any) => user.id === id);
        users.splice(index, 1);
        return new Response(users, 200);
    }
}

@Endpoint()
@AfterAll(finish)
class Greeting {
    @After(changeResponse)
    @Get("")
    public getGreeting(url: IUrl, body: any, headers: Headers, next: () => {}) {
        console.log("HELLO EVERYBODY");
        return next();
    }
}

@Endpoint()
class OtherClass {
    @Get("$name")
    public getName(url: IUrl, body: any, headers: Headers, next: () => {}) {
        return new Response(url.args, 200);
    }
}

const endpoints = [new User(), [new Greeting(), new OtherClass()]];

const configRouter: IRouterOptions = {
  authConnection: true,
  connectionMode: true,
  endpoints,
  road: app,
  verbose: true,
};

new SetRouter(configRouter);

server.listen(3000, () => {
  console.log("Serve is running in the port 3000");
});

```

### Config your project:
```json
{
	"compilerOptions": {
		"module": "commonjs",
		"target": "es6",
		"strict": true,
		"sourceMap": true,
		"rootDir": ".",
		"experimentalDecorators": true,
		"emitDecoratorMetadata": true,
		"outDir": "./lib",
		"declaration": true
	},

	"include": [
		"src/index.ts"
	]
}
```
## Run Spiel Server tests
`npm test`

## License
Spiel Server is MIT licensed. See [license](https://github.com/spieljs/spiel-server/blob/master/LICENSE)
