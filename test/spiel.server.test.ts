import * as Code from "code";
import * as jwt from "jwt-simple";
import * as Lab from "lab";
import * as request from "request";
import * as rp from "request-promise";
import "./server";

const lab = Lab.script();

export {lab};

lab.experiment("Server", () => {
    let headers: {authconnection: string};
    let secret: string;

    lab.before(() => {
        const permissions = ["admin", "user"];
        secret = "7983ac7ab1f7f706a962f6679bbdaae9ede06519c75e1ae7f1f92f3474eae21d";
        const token = jwt.encode(permissions, secret);
        headers = {authconnection : token};
    });

    lab.test("Has to change the response in greeteng endpoint", async () => {
        const response: any = await rp("http://localhost:3000/greeting/getgreeting", {json: true, headers});
        Code.expect(response.greet).to.be.equal("Bye");
    });

    lab.test("Has to return all the users", async () => {
        const response: any = await rp("http://localhost:3000/user/getusers", {json: true, headers});
        Code.expect(response).to.have.length(4);
    });

    lab.test("Has to get the name 'Lola'", async () => {
        const response: any = await rp("http://localhost:3000/user/getuser/4", {json: true, headers});
        Code.expect(response.name).to.be.equal("Lola");
    });

    lab.test("Has to add an user", async () => {
        const options = {
            body: {
                id: 5,
                name: "Pepe",
                permission: "user",
            },
            headers,
            json: true,
            method: "POST",
            uri: "http://localhost:3000/user/adduser",
        };
        const response: any = await rp(options);
        Code.expect(response).to.have.length(5);
        Code.expect(response[4].name).to.be.equal("Pepe");
    });

    lab.test("Has to update a user", async () => {
        const options = {
            body: {
                permission: "admin",
            },
            headers,
            json: true,
            method: "PUT",
            uri: "http://localhost:3000/user/updateuser/5",
        };
        const response: any = await rp(options);
        const isUpdate = response.some((user: any) => user.name === "Pepe" && user.permission === "admin");
        Code.expect(isUpdate).to.be.true();
    });

    lab.test("Has to delete an user", async () => {
        const options = {
            headers,
            json: true,
            method: "DELETE",
            uri: "http://localhost:3000/user/deleteuser/5",
        };
        const response: any = await rp(options);
        Code.expect(response).to.have.length(4);
    });

    lab.test("Has to return the name param", async () => {
        const response = await rp("http://localhost:3000/otherclass/getname/Ramona", {headers, json: true});
        Code.expect(response.name).to.have.equal("Ramona");
    });

    lab.test("has to get all classes and methods", async () => {
        const response: any = await rp("http://localhost:3000", {headers, json: true});
        Code.expect(response).to.have.length(3);
        Code.expect(response[0].props).to.have.length(5);
        Code.expect(response[1].props).to.have.length(1);
        Code.expect(response[2].props).to.have.length(1);
    });

    lab.test("has to get the classes and method which doesn't have the permision admin", async () => {
        const permissions = ["user"];
        const token = jwt.encode(permissions, secret);
        headers = {authconnection : token};
        const response: any = await rp("http://localhost:3000", {headers, json: true});
        Code.expect(response).to.have.length(3);
        Code.expect(response[0].props).to.have.length(2);
        Code.expect(response[1].props).to.have.length(1);
        Code.expect(response[2].props).to.have.length(1);
    });
});
