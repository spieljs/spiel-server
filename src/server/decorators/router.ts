import {middleware, Road} from "roads";
import {IRoute, IRouteMethod, getAllMethods} from "../helpers";

const routes: IRoute = {};

export function Route(path: string) {
    return function<T extends {new(...args: any[]): {}}>(constructor: T) {
        return class extends constructor {
            path = (path) ? `/${path}` : `/${constructor.name}`
        };
    };
}

export function Delete(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        if(!target.routers) target.routers = [];
        target.routers[key] = {
            method: "DELETE",
            path
        };
    };
}

export function Get(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        if(!target.routers) target.routers = [];
        target.routers[key] = {
            method: "GET",
            path
        };
    };
}

export function Head(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        if(!target.routers) target.routers = [];
        target.routers[key] = {
            method: "HEAD",
            path
        };
    };
}

export function Options(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        if(!target.routers) target.routers = [];
        target.routers[key] = {
            method: "OPTIONS",
            path
        };
    };
}

export function Patch(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        if(!target.routers) target.routers = [];
        target.routers[key] = {
            method: "PATCH",
            path
        };
    };
}

export function Post(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        if(!target.routers) target.routers = [];
        target.routers[key] = {
            method: "POST",
            path
        };
    };
}

export function Put(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        if(!target.routers) target.routers = [];
        target.routers[key] = {
            method: "PUT",
            path
        };
    };
}
