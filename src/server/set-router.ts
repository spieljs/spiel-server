import { middleware, Response, Road } from "roads";
import { getAllMethods, IRouteClasses, IRouteMethod, IRouter, IRouterOptions, RouteConnect } from "./helpers";

export class SetRouter {
  protected routes: IRouter[];
  protected router: middleware.SimpleRouter;
  protected RouterConnect: RouteConnect = [];
  protected road: Road;
  protected connectionMode: boolean;
  protected verbose: boolean;

  constructor(options: IRouterOptions) {
    this.road = options.road;
    this.routes = options.routes;
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
    this.getRoutes();

    if (this.connectionMode) {
      this.setConnection();
    }
  }

  protected infoRequest() {
    this.road.use((method: string, request: any, body: any, Headers: Headers, next: Function) => {
      console.log(`${method} ${request.path}`);
      return next();
    });
  }

  protected setRouterConnect(routers: IRouter, routeName: string, path: string): IRouteClasses {
    return {
      name: routeName,
      props: Object.keys(routers)
        .filter((router: string) => router !== "before" && router !== "after")
        .map((router) => {
        return {
          method: routers[router].method,
          name: router,
          path: `${path}${(routers[router].path) ? `/${routers[router].path}` : ""}`,
        };
      }),
    };
  }

  protected setConnection() {
    this.router.addRoute("GET", "/", () => {
      return new Response(this.RouterConnect, 200);
    });
  }

  private getRoutes() {
    let after: Function[] = [];
    this.routes.forEach((route) => {
      const methods = getAllMethods(route);
      const path = route.path;
      const routers = route.routers;

      if (routers.before && routers.before.length) {
        this.buildBeforeMiddlewares(routers.before);
      }

      methods.forEach((prop: string) => {
        this.router.addRoute(routers[prop].method, `${path}${(routers[prop].path)
          ? `/${routers[prop].path}`
          : ""}`, route[prop]);
      });

      if (routers.after && routers.after.length) {
        after = after.concat(routers.after);
      }

      this.RouterConnect.push(this.setRouterConnect(routers, route.constructor.name, path));
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
