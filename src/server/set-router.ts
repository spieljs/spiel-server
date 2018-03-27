import { middleware, Response, Road } from "roads";
import { EndpointsConnect, getPropsObject, IEndpoint, IEndpoints,
  IMiddleware, IMiddlewareAll, IRouteMethod, IRouterOptions, Middleware} from "./helpers";

/**
 * Set the router with the endpoints and middlewares
 * @see <a href="https://github.com/spieljs/spiel-server#setting-the-router" target="_blank">Setting router</a>
 */
export class SetRouter {
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
    const endpoints: IEndpoint[] = options.endpoints;
    this.verbose = (options.verbose)
      ? options.verbose
      : false;
    this.connectionMode = (options.connectionMode)
      ? options.connectionMode
      : true;

    this.road.use(middleware.parseBody);

    if (options.cors) {
      this.road.use(middleware.cors(options.cors));
    }

    if (this.verbose) {
      this.infoRequest();
    }

    this.router = new middleware.SimpleRouter();
    this.getEndpoints(endpoints);

    if (this.verbose) {
      console.log(this.router);
    }

    if (this.connectionMode) {
      this.setConnection();
    }
  }

  protected infoRequest() {
    this.road.use((method: string, request: any, body: any, headers: Headers, next: () => any) => {
      console.log(`${method} ${request}`);
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
          path: endpointMethods[method].path,
        };
      }),
    };
  }

  protected setConnection() {
    this.router.addRoute("GET", "/", () => {
      return new Response(this.RouterConnect, 200);
    });
  }

  private getEndpoints(endpoints: IEndpoint[]) {
    let after: any = [];
    endpoints.forEach((endpoint: any) => {
      if (endpoint.length) {
        console.log(endpoint);
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

        this.RouterConnect.push(this.setRouterConnect(methods, endpoint.constructor.name, path));
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
