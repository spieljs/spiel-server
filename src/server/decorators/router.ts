import {middleware, Road} from "roads";

export function Router(path: string) {
    return function<T extends {new(...args: any[]): {}}>(constructor: T) {
        return class extends constructor {
            public path = `/${(path) ? path : constructor.name}`;
            public router = [];
        };
    };
}

export function Delete(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        target.prototype.route[key] = {};
        target.prototype.route[key].path = `${target.prototype.path}/${path}`;
        target.prototype.route[key].method = "DELETE";
    };
}

export function Get(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        target.prototype.route[key] = {};
        target.prototype.route[key].path = `${target.prototype.path}/${path}`;
        target.prototype.route[key].method = "GET";
    };
}

export function Head(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        target.prototype.route[key] = {};
        target.prototype.route[key].path = `${target.prototype.path}/${path}`;
        target.prototype.route[key].method = "HEAD";
    };
}

export function Options(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        target.prototype.route[key] = {};
        target.prototype.route[key].path = `${target.prototype.path}/${path}`;
        target.prototype.route[key].method = "OPTIONS";
    };
}

export function Patch(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        target.prototype.route[key] = {};
        target.prototype.route[key].path = `${target.prototype.path}/${path}`;
        target.prototype.route[key].method = "PATCH";
    };
}

export function Post(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        target.prototype.route[key] = {};
        target.prototype.route[key].path = `${target.prototype.path}/${path}`;
        target.prototype.route[key].method = "POST";
    };
}

export function Put(path: string) {
    return (target: any, key: string, descriptor: PropertyDescriptor): void => {
        target.prototype.route[key] = {};
        target.prototype.route[key].path = `${target.prototype.path}/${path}`;
        target.prototype.route[key].method = "PUT";
    };
}
