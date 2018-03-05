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
import {Endpoint, Get, IBody, Road, SetRouter} from "spiel-server";

@Endpoint("user")
class User {
    private body: IBody;

    @Before(info)
    @Get("")
    public getUsers() {
        return new Response(users, 200);
    }

    @Post("")
    public addUser(url: any) {
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
    private body: IBody;

    @Post("")
    public addUser(url: any, body: IBody) {
        const user = this.body;
        users.push(user);
        return new Response(users, 200);
    }
}
```

### Create your middlewares
```typescript
import {After, AfterAll, Before, BeforeAll, Delete, Endpoint, Get, HttpError,
    IBody, IRouterOptions, middleware, Post, Put, Response,
    Road, Server, SetRouter} from "../src";
import {users} from "./assets";

const info = (method: string, path: string, body: IBody, headers: Headers, next: () => any) => {
    if (path.match(/^\/user/g)) {
        console.log(`A ${method} request was made to ${JSON.stringify(path)}`);
        return next();
    } else {
        return next();
    }
};

const infoAll = (method: string, path: string, body: IBody, headers: Headers, next: () => any) => {
    console.log("The middleware start");
    return next();
};

const changeResponse = (method: string, path: string, body: IBody, headers: Headers, next: () => any) => {
    if (path.match(/^\/greeting/g)) {
        console.log("End");
        return new Response({greet: "Bye"}, 200);
    } else {
        return next();
    }
};

const finish = (method: string, path: string, body: IBody, headers: Headers, next: () => any) => {
    console.log("Finish");
    return next();
};

@BeforeAll(infoAll)
@AfterAll(finish)
@Endpoint("user")
class User {
    private body: IBody;

    @Before(info)
    @Get("")
    public getUsers() {
        return new Response(users, 200);
    }
    @Get("#id")
    public getUser(url: any) {
        const id = url.args.id;
        const user: any = users.find((elment) => elment.id === id);
        return new Response(user, 200);
    }

    @Post("")
    public addUser(url: any) {
        const user = this.body;
        users.push(user);
        return new Response(users, 200);
    }

    @Put("#id")
    public updateUser(url: any) {
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

    @Delete("#id")
    public deleteUser(url: any) {
        const id = url.args.id;
        const index = users.findIndex((user: any) => user.id === id);
        users.splice(index, 1);
        return new Response(users, 200);
    }
}

@Endpoint("greeting")
class Greeting {
    @After(changeResponse)
    @Get("")
    public getGreeting(url: any, body: any, headers: any, next: () => {}) {
        console.log("HELLO EVERYBODY");
        return next();
    }
}
```
Consider that all middlewares will be executed before or after the endpoint response if you don't implement logic for the path endpoint into the middleware and also remember in return next in the method endpoint if you want to execute an after middleware.

### Setting the router
```typescript
import {Endpoint, Get, IRouterOptions, Road, Server, SetRouter} from "spiel-server";

const app = new Road();

@Endpoint("greeting")
class Greeting {
    @After(changeOut)
    @Get("")
    public getGreeting(url: any, body: any, headers: any, next: Function) {
        console.log("HELLO EVERYBODY");
        return next()
    }
}

const endpoints = [new Greeting()];

const configRouter: IRouterOptions = {
  road: app,
  endpoints,
  connectionMode: true,
  verbose: true,
}

new SetRouter(configRouter);
```
### Using the roads API
```typescript
import {Road, middleware} from "spiel-server";

const app = new Road();

app.use(middleware.cors(['http://localhost:8080'], ['authorization']));
```
About the Roads Api see [in Roads docs](https://github.com/Dashron/roads#index)

### Complete example with Server
```typescript
import {After, AfterAll, Before, BeforeAll, Delete, Endpoint, Get, HttpError,
    IBody, IRouterOptions, middleware, Post, Put, Response,
    Road, Server, SetRouter} from "../src";
import {users} from "./assets";

const app = new Road();

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

const info = (method: string, path: string, body: IBody, headers: Headers, next: () => any) => {
    if (path.match(/^\/user/g)) {
        console.log(`A ${method} request was made to ${JSON.stringify(path)}`);
        return next();
    } else {
        return next();
    }
};

const infoAll = (method: string, path: string, body: IBody, headers: Headers, next: () => any) => {
    console.log("The middleware start");
    return next();
};

const changeResponse = (method: string, path: string, body: IBody, headers: Headers, next: () => any) => {
    if (path.match(/^\/greeting/g)) {
        console.log("End");
        return new Response({greet: "Bye"}, 200);
    } else {
        return next();
    }
};

const finish = (method: string, path: string, body: IBody, headers: Headers, next: () => any) => {
    console.log("Finish");
    return next();
};

@BeforeAll(infoAll)
@AfterAll(finish)
@Endpoint("user")
class User {
    private body: IBody;

    @Before(info)
    @Get("")
    public getUsers() {
        return new Response(users, 200);
    }
    @Get("#id")
    public getUser(url: any) {
        const id = url.args.id;
        const user: any = users.find((elment) => elment.id === id);
        return new Response(user, 200);
    }

    @Post("")
    public addUser(url: any) {
        const user = this.body;
        users.push(user);
        return new Response(users, 200);
    }

    @Put("#id")
    public updateUser(url: any) {
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

    @Delete("#id")
    public deleteUser(url: any) {
        const id = url.args.id;
        const index = users.findIndex((user: any) => user.id === id);
        users.splice(index, 1);
        return new Response(users, 200);
    }
}

@Endpoint("greeting")
class Greeting {
    @After(changeResponse)
    @Get("")
    public getGreeting(url: any, body: any, headers: any, next: () => {}) {
        console.log("HELLO EVERYBODY");
        return next();
    }
}

const endpoints = [new User(), new Greeting()];

const configRouter: IRouterOptions = {
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
