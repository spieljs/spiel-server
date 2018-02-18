import * as Code from "code";
import * as Lab from "lab";
import * as request from "request";
import * as rp from "request-promise";

const lab = Lab.script();

export {lab};

lab.experiment("Server", () => {

    lab.test("Has to return all the users", async () => {
        const response: any = await rp("http://localhost:3000/user", {json: true});
        Code.expect(response).to.have.length(4);
    });

    lab.test("Has to get the name 'Lola'", async () => {
        const response: any = await rp("http://localhost:3000/user/4", {json: true});
        Code.expect(response.name).to.be.equal("Lola");
    });

    lab.test("Has to add an user", async () => {
        const options = {
            body: {
                id: 5,
                name: "Pepe",
                permission: "user",
            },
            json: true,
            method: "POST",
            uri: "http://localhost:3000/user",
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
            json: true,
            method: "PUT",
            uri: "http://localhost:3000/user/5",
        };
        const response: any = await rp(options);
        const isUpdate = response.some((user) => user.name === "Pepe" && user.permission === "admin");
        Code.expect(isUpdate).to.be.true();
    });

    lab.test("Has to delete an user", async () => {
        const options = {
            json: true,
            method: "DELETE",
            uri: "http://localhost:3000/user/5",
        };
        const response: any = await rp(options);
        Code.expect(response).to.have.length(4);
    });

    lab.test("has to get all classe and method", async() => {
        const response: any = await rp("http://localhost:3000", {json: true});
        Code.expect(response).to.have.length(2);
        Code.expect(response[0].props).to.have.length(5);
        Code.expect(response[1].props).to.have.length(1);
    })
});