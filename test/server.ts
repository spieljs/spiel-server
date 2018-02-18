import {Delete, Get, HttpError, IRouter, middleware, Post, Put, Response, Road, Route, Server, SetRouter} from "../src";
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

@Route("user")
class User {
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
    public addUser(url: any, body: any) {
        const user = body;
        users.push(user);
        return new Response(users, 200);
    }

    @Put("#id")
    public updateUser(url: any, body: any) {
        const id = url.args.id;
        const resp = users.map((user) => {
            const value = user;
            if (value.id === id) {
                value.permission = body.permission;
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

@Route("greeting")
class Greeting {
    @Get("")
    public getGreeting() {
        return new Response({greet: "hello"}, 200);
    }
}

const routes = [new User(), new Greeting()];

new SetRouter(routes, app);

server.listen(3000, () => {
    console.log("Serve is running in the port 3000");
});
