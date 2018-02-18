import {middleware, Road} from "roads";
import {IRoute, IRouteMethod} from "../helpers";

const routes: IRoute = {};

export function Route(path: string) {
    return function<T extends {new(...args: any[]): {}}>(constructor: T) {
        return class extends constructor {
            public router = Object.keys(routes)
                .filter((route) => routes[route].target.constructor.name === constructor.name)
                .map((route) => {
                    const value = {
                        method: routes[route].method,
                        name: route,
                        path: `/${(path) ? path : constructor.name}${routes[route].path ?
                            `/${routes[route].path}` : ""}`,
                    };
    
                    return value;
                });
        };
    };
}

export function Delete(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        const route: IRouteMethod = {
            method: "DELETE",
            path,
            target,
        };

        getRoute(route, key);
    };
}

export function Get(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        const route: IRouteMethod = {
            method: "GET",
            path,
            target,
        };

        getRoute(route, key);
    };
}

export function Head(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        const route: IRouteMethod = {
            method: "HEAD",
            path,
            target,
        };

        getRoute(route, key);
    };
}

export function Options(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        const route: IRouteMethod = {
            method: "OPTIONS",
            path,
            target,
        };

        getRoute(route, key);
    };
}

export function Patch(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        const route: IRouteMethod = {
            method: "PATCH",
            path,
            target,
        };

        getRoute(route, key);
    };
}

export function Post(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        const route: IRouteMethod = {
            method: "POST",
            path,
            target,
        };

        getRoute(route, key);
    };
}

export function Put(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        const route: IRouteMethod = {
            method: "PUT",
            path,
            target,
        };

        getRoute(route, key);
    };
}

function getRoute(route: IRouteMethod, key: string) {
    routes[key] = route;
}
