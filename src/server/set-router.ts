import { middleware, Response, Road } from "roads";
import { getAllMethods, IRouteClasses, IRouteMethod, IRouter, IRouterOptions, RouteConnect } from "./helpers";

export class SetRouter {
  protected routes: IRouter[];
  protected router: middleware.SimpleRouter;
  protected RouterConnect: RouteConnect = [];
  protected road: Road;
  protected connectionMode: boolean;

  constructor(options: IRouterOptions) {
    this.road = options.road;
    this.routes = options.routes;
    this.connectionMode = (options.connectionMode)
      ? options.connectionMode
      : true;
    this.router = new middleware.SimpleRouter();
    this.getRoutes();

    if (this.connectionMode) {
      this.setConnection();
    }
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

  private getRoutes() {
    let after: Function[] = [];
    this.routes.forEach((route) => {
      const methods = getAllMethods(route);
      const path = route.path;
      const routers = route.routers;

      console.log(routers);

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

    console.log(this.router);
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

  private setConnection() {
    this.router.addRoute("GET", "/", () => {
      return new Response(this.RouterConnect, 200);
    });
  }
}
