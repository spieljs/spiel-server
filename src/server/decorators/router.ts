import { middleware, Road } from "roads";
import { getPropsObject, IRoute, IRouteMethod } from "../helpers";

const routes: IRoute = {};

/**
 * Decoration to add endpoint route
 * @param path Path of the enpoint
 * @see <a href="https://github.com/spieljs/spiel-server#create-your-endpoints" target="_blank">Create your enpoints</a>
 */
export function Endpoint(path: string) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      public path = (path) ? `/${path}` : `/${constructor.name}`;
    };
  };
}

/**
 * Middleware to excute bafore all the endpoints
 * @param middleware Function which is executed from the middleware
 * @see <a href="https://github.com/spieljs/spiel-server#create-your-middlewares" target="_blank">Create your middleware</a>
 */
export function BeforeAll(middleware: Function) {
  const before = "before";
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

        this.methods[before].unshift(middleware);
      }
    };
  };
}

/**
 * Middleware to excute after all the endpoints
 * @param middleware Function which is executed from the middleware
 * @see <a href="https://github.com/spieljs/spiel-server#create-your-middlewares" target="_blank">Create your middleware</a>
 */
export function AfterAll(middleware: Function) {
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

        this.methods[after].push(middleware);
      }
    };
  };
}

/**
 * Middleware to excute bafore the method
 * @param middleware Function which is executed from the middleware
* @see <a href="https://github.com/spieljs/spiel-server#create-your-middlewares" target="_blank">Create your middleware</a>
 */
export function Before(middleware: Function) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    const before = "before";
    if (!target.methods) {
      target.methods = [];
    }

    if (!target.methods[before]) {
      target.methods[before] = [];
    }

    target.methods[before].push(middleware);
  };
}

/**
 * Middleware to excute after the method
 * @param middleware Function which is executed from the middleware
 * @see <a href="https://github.com/spieljs/spiel-server#create-your-middlewares" target="_blank">Create your middleware</a>
 */
export function After(middleware: Function) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    const after = "after";
    if (!target.methods) {
      target.methods = [];
    }

    if (!target.methods[after]) {
      target.methods[after] = [];
    }

    target.methods[after].push(middleware);
  };
}

/**
 * Endpoint method delete
 * @param path Path of the delete method
 */
export function Delete(path: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "DELETE",
      path,
    };
  };
}

/**
 * Endpoint method get
 * @param path Path of the get method
 */
export function Get(path: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "GET",
      path,
    };
  };
}

/**
 * Endpoint method Head
 * @param path Path of the Head method
 */
export function Head(path: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "HEAD",
      path,
    };
  };
}

/**
 * Endpoint method Options
 * @param path Path of the Options method
 */
export function Options(path: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "OPTIONS",
      path,
    };
  };
}

/**
 * Endpoint method Patch
 * @param path Path of the Patch method
 */
export function Patch(path: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "PATCH",
      path,
    };
  };
}

/**
 * Endpoint method Post
 * @param path Path of the Post method
 */
export function Post(path: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "POST",
      path,
    };
  };
}

/**
 * Endpoint method Put
 * @param path Path of the Put method
 */
export function Put(path: string) {
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!target.methods) {
      target.methods = [];
    }

    target.methods[key] = {
      method: "PUT",
      path,
    };
  };
}
