import { middleware, Road } from "roads";
import {getPropsObject, IMiddleware, IRoute, IRouteMethod } from "../helpers";

const routes: IRoute = {};

/**
 * Decoration to add endpoint route
 * @param path Path of the enpoint
 * @see <a href="https://github.com/spieljs/spiel-server#create-your-endpoints" target="_blank">
 * Create your enpoints</a>
 */
export function Endpoint() {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      public path = `/${constructor.name.toLowerCase()}`;
      public body = {};
    };
  };
}

/**
 * Middleware to excute bafore all the endpoints
 * @param middlw Function which is executed from the middleware
 * @see <a href="https://github.com/spieljs/spiel-server#create-your-middlewares" target="_blank">
 * Create your middleware</a>
 */
export function BeforeAll(middlw: (...args: any[]) => any) {
  const before: string = "before";
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      public methods: any = constructor.prototype.methods;
      constructor(...args: any[]) {
        super(...args);
        if (!this.methods) {
          this.methods = [];
        }

        if (!this.methods[before]) {
          this.methods[before] = [];
        }

        this.methods[before].unshift(
          {
            middleware: middlw,
            path: `/${constructor.name.toLowerCase()}`,
          });
      }
    };
  };
}

/**
 * Middleware to excute after all the endpoints
 * @param middlw Function which is executed from the middleware
 * @see <a href="https://github.com/spieljs/spiel-server#create-your-middlewares" target="_blank">
 * Create your middleware</a>
 */
export function AfterAll(middlw: (...args: any[]) => any) {
  const after = "after";
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      public methods: any = constructor.prototype.methods;
      constructor(...args: any[]) {
        super(...args);
        if (!this.methods) {
          this.methods = [];
        }

        if (!this.methods[after]) {
          this.methods[after] = [];
        }

        this.methods[after].push(
          {
            middleware: middlw,
            path: `/${constructor.name.toLowerCase()}`,
          });
      }
    };
  };
}

/**
 * Middleware to excute bafore the method
 * @param middleware Function which is executed from the middleware
 * @see <a href="https://github.com/spieljs/spiel-server#create-your-middlewares" target="_blank">
 * Create your middleware</a>
 */
export function Before(middlw: (...args: any[]) => any) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    const before = "before";
    if (!target.methods) {
      target.methods = [];
    }

    if (!target.methods[before]) {
      target.methods[before] = [];
    }

    target.methods[before].push({
      middleware: middlw,
      path: `/${target.constructor.name.toLowerCase()}/${key.toLowerCase()}`,
    });
  };
}

/**
 * Middleware to excute after the method
 * @param middleware Function which is executed from the middleware
 * @see <a href="https://github.com/spieljs/spiel-server#create-your-middlewares" target="_blank">
 * Create your middleware</a>
 */
export function After(middlw: (...args: any[]) => any) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    const after = "after";
    if (!target.methods) {
      target.methods = [];
    }

    if (!target.methods[after]) {
      target.methods[after] = [];
    }

    target.methods[after].push({
      middleware: middlw,
      path: `/${target.constructor.name.toLowerCase()}/${key.toLowerCase()}`,
    });
  };
}

/**
 * Endpoint method delete
 * @param path Path of the delete method
 */
export function Delete(path: string, permission?: {name: string, secret: string}) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "DELETE",
      path: `/${target.constructor.name.toLowerCase()}/${key.toLowerCase()}${path ?
        `/${path}` : ""}`,
      permission,
    };
  };
}

/**
 * Endpoint method get
 * @param path Path of the get method
 */
export function Get(path: string, permission?: {name: string, secret: string}) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "GET",
      path: `/${target.constructor.name.toLowerCase()}/${key.toLowerCase()}${path ?
        `/${path}` : ""}`,
      permission,
    };
  };
}

/**
 * Endpoint method Head
 * @param path Path of the Head method
 */
export function Head(path: string, permission?: {name: string, secret: string} ) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "HEAD",
      path: `/${target.constructor.name.toLowerCase()}/${key.toLowerCase()}${path ?
        `/${path}` : ""}`,
      permission,
    };
  };
}

/**
 * Endpoint method Options
 * @param path Path of the Options method
 */
export function Options(path: string, permission?: {name: string, secret: string} ) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "OPTIONS",
      path: `/${target.constructor.name.toLowerCase()}/${key.toLowerCase()}${path ?
        `/${path}` : ""}`,
      permission,
    };
  };
}

/**
 * Endpoint method Patch
 * @param path Path of the Patch method
 */
export function Patch(path: string, permission?: {name: string, secret: string} ) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "PATCH",
      path: `/${target.constructor.name.toLowerCase()}/${key.toLowerCase()}${path ?
        `/${path}` : ""}`,
      permission,
    };
  };
}

/**
 * Endpoint method Post
 * @param path Path of the Post method
 */
export function Post(path: string, permission?: {name: string, secret: string} ) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "POST",
      path: `/${target.constructor.name.toLowerCase()}/${key.toLowerCase()}${path ?
        `/${path}` : ""}`,
      permission,
    };
  };
}

/**
 * Endpoint method Put
 * @param path Path of the Put method
 */
export function Put(path: string, permission?: {name: string, secret: string} ) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "PUT",
      path: `/${target.constructor.name.toLowerCase()}/${key.toLowerCase()}${path ?
        `/${path}` : ""}`,
      permission,
    };
  };
}
