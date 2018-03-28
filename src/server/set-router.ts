import * as jwt from "jwt-simple";
import { middleware, Response, Road } from "roads";
import { EndpointsConnect, getPropsObject, IEndpoint, IEndpoints,
  IMiddleware, IMiddlewareAll, IRouteMethod, IRouterOptions, Middleware} from "./helpers";

/**
 * Set the router with the endpoints and middlewares
 * @see <a href="https://github.com/spieljs/spiel-server#setting-the-router" target="_blank">Setting router</a>
 */
export class SetRouter {
  private endpoints: IEndpoint[];
  private authConnection: boolean;
  private router: middleware.SimpleRouter;
  private routerConnect: EndpointsConnect = [];
  private road: Road;
  private connectionMode: boolean;
  private connectionPath: string;
  private verbose: boolean;

  /**
   * @param options Router options
   */
  constructor(options: IRouterOptions) {
    this.road = options.road;
    this.endpoints = options.endpoints;
    this.authConnection = (options.authConnection)
      ? options.authConnection
      : false;
    this.verbose = (options.verbose)
      ? options.verbose
      : false;
    this.connectionMode = (options.connectionMode)
      ? options.connectionMode
      : true;
    this.connectionPath = (options.connectionPath)
      ? options.connectionPath
      : "/";

    this.road.use(middleware.parseBody);

    if (options.cors) {
      this.road.use(middleware.cors(options.cors));
    }

    if (this.verbose) {
      this.infoRequest();
    }

    this.router = new middleware.SimpleRouter();

    this.getEndpoints(this.endpoints);

    if (this.connectionMode && this.authConnection) {
      this.setAuthConnect();
    } else if (this.connectionMode && !this.authConnection) {
      this.setConnection();
    }

    if (this.verbose) {
      console.log(this.router);
    }
  }

  private infoRequest() {
    this.road.use((method: string, request: any, body: any, headers: Headers, next: () => any) => {
      console.log(`${method} ${request}`);
      return next();
    });
  }

  private setRouterConnect(endpointMethods: IEndpoint, routeName: string, path: string): IEndpoints {
    return {
      name: routeName,
      props: Object.keys(endpointMethods)
        .filter((method: string) => method !== "before" && method !== "after"
          && (!this.authConnection || endpointMethods[method].allowed))
        .map((method) => {
        return {
          method: endpointMethods[method].method,
          name: method,
          path: endpointMethods[method].path,
        };
      }),
    };
  }

  private setConnection() {
    this.router.addRoute("GET", this.connectionPath, () => {
      return new Response(this.routerConnect, 200);
    });
  }

  private setAuthConnect() {
    this.road.use((method: string, path: string, body: any, headers: any, next: () => any) => {
      if (path === this.connectionPath && headers.authconnection) {
        const token = headers.authconnection;
        this.routerConnect = [];
        this.checkAuthConnect(token, this.endpoints);
        return new Response(this.routerConnect, 200);
      } else if (path === this.connectionPath && !headers.authconnection) {
        const message = "Currently you are using authConnect but you missend request the header " +
          "authconnection";
        return new Response(message, 500);
      }

      return next();
    });
  }

  private checkAuthConnect(token: string, endpoints: IEndpoint[]) {
    endpoints.forEach((endpoint: any) => {
      if (endpoint.length) {
        this.checkAuthConnect(token, endpoint);
      } else {
        const props = getPropsObject(endpoint);
        const path = endpoint.path;
        const methods = endpoint.methods;

        if (methods.before && methods.before.length) {
          this.buildMiddlewares(methods.before);
        }

        props.forEach((prop: string) => {
          this.router.addRoute(methods[prop].method, methods[prop].path, endpoint[prop]);
          if (methods[prop].permission ) {
            const permission = methods[prop].permission;
            const decodeToken = jwt.decode(token, permission.secret);
            methods[prop].allowed = decodeToken.includes(permission.name);
          } else {
            methods[prop].allowed = true;
          }
        });

        this.routerConnect.push(this.setRouterConnect(methods, endpoint.constructor.name, path));
      }
    });
  }

  private getEndpoints(endpoints: IEndpoint[]) {
    let after: any = [];
    endpoints.forEach((endpoint: any) => {
      if (endpoint.length) {
        this.getEndpoints(endpoint);
      } else {
        const props = getPropsObject(endpoint);
        const path = endpoint.path;
        const methods = endpoint.methods;

        if (methods.before && methods.before.length) {
          this.buildMiddlewares(methods.before);
        }

        props.forEach((prop: string) => {
          this.router.addRoute(methods[prop].method, methods[prop].path, endpoint[prop]);
        });

        if (methods.after && methods.after.length) {
          after = after.concat(methods.after);
        }

        if (!this.authConnection) {
          this.routerConnect.push(this.setRouterConnect(methods, endpoint.constructor.name, path));
        }
      }
    });

    this.router.applyMiddleware(this.road);

    if (after && after.length) {
      this.buildMiddlewares(after);
    }
  }

  private buildMiddlewares(middlewares: IMiddleware[]) {
    middlewares.forEach( (middlwsMethod) => {
      this.road.use((method: string, path: string, body: any, headers: Headers, next: () => any) => {
        const regex = new RegExp(`^${middlwsMethod.path}`);
        if (path.match(regex)) {
          return middlwsMethod.middleware(method, path, body, headers, next);
        }
        return next();
      });
    });
  }
}
