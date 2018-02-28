import { middleware, Response, Road } from "roads";
import { EndpointsConnect, getPropsObject, IEndpoint, IEndpoints, IRouteMethod, IRouterOptions } from "./helpers";

/**
 * Set the router with the endpoints and middlewares
 * @see <a href="https://github.com/spieljs/spiel-server#setting-the-router" target="_blank">Setting router</a>
 */
export class SetRouter {
  protected endpoints: IEndpoint[];
  protected router: middleware.SimpleRouter;
  protected RouterConnect: EndpointsConnect = [];
  protected road: Road;
  protected connectionMode: boolean;
  protected verbose: boolean;

  /**
   * @param options Router options
   */
  constructor(options: IRouterOptions) {
    this.road = options.road;
    this.endpoints = options.endpoints;
    this.verbose = (options.verbose)
      ? options.verbose
      : false;
    this.connectionMode = (options.connectionMode)
      ? options.connectionMode
      : true;

    if (this.verbose) {
      this.infoRequest();
    }

    this.router = new middleware.SimpleRouter();
    this.getendpoints();

    if (this.connectionMode) {
      this.setConnection();
    }
  }

  protected infoRequest() {
    this.road.use((method: string, request: any, body: any, headers: Headers, next: Function) => {
      console.log(`${method} ${request.path}`);
      return next();
    });
  }

  protected setRouterConnect(endpointMethods: IEndpoint, routeName: string, path: string): IEndpoints {
    return {
      name: routeName,
      props: Object.keys(endpointMethods)
        .filter((method: string) => method !== "before" && method !== "after")
        .map((method) => {
        return {
          method: endpointMethods[method].method,
          name: method,
          path: `${path}${(endpointMethods[method].path) ? `/${endpointMethods[method].path}` : ""}`,
        };
      }),
    };
  }

  protected setConnection() {
    this.router.addRoute("GET", "/", () => {
      return new Response(this.RouterConnect, 200);
    });
  }

  private getendpoints() {
    let after: Function[] = [];
    this.endpoints.forEach((endpoint) => {
      const props = getPropsObject(endpoint);
      const path = endpoint.path;
      const methods = endpoint.methods;

      if (methods.before && methods.before.length) {
        this.buildBeforeMiddlewares(methods.before);
      }

      props.forEach((prop: string) => {
        this.router.addRoute(methods[prop].method, `${path}${(methods[prop].path)
          ? `/${methods[prop].path}`
          : ""}`, endpoint[prop]);
      });

      if (methods.after && methods.after.length) {
        after = after.concat(methods.after);
      }

      this.RouterConnect.push(this.setRouterConnect(methods, endpoint.constructor.name, path));
    });

    this.router.applyMiddleware(this.road);
    if (after && after.length) {
      this.buildAfterMiddlewares(after);
    }

    if (this.verbose) {
      console.log(this.router);
    }
  }

  private buildBeforeMiddlewares(before: any[]) {
    before.forEach((middleware) => {
      this.road.use(middleware);
    });
  }

  private buildAfterMiddlewares(after: any[]) {
    after.forEach((middleware) => {
      this.road.use(middleware);
    });
  }
}
