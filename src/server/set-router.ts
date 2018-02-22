import { middleware, Response, Road} from "roads";
import { IRouteClasses, IRouteMethod, IRouter, RouteConnect, getAllMethods} from "./helpers";

export class SetRouter {
    protected routes: IRouter[];
    protected router: middleware.SimpleRouter;
    protected RouterConnect: RouteConnect = [];

    constructor(routes: IRouter[], road: Road) {
        this.routes = routes;
        this.router = new middleware.SimpleRouter(road);
        this.getRoutes();
        this.setConnection();
    }

    private getRoutes() {
        this.routes.forEach((route) => {
            const methods = getAllMethods(route);
            const path = route.path;
            const routers = route.routers;
            methods.forEach((prop: string) => {
                this.router.addRoute(routers[prop].method, `${path}${(routers[prop].path)
                    ? `/${routers[prop].path}`
                    : ""}`, route[prop]);
            });
            this.RouterConnect.push(this.setRouterConnect(routers, route.constructor.name, path));
        });

        console.log(this.router);
    }

    protected setRouterConnect(routers: IRouter, routeName: string, path: string): IRouteClasses {
        return {
            name: routeName,
            props: Object.keys(routers).map((router) => {
                return {
                    name: router,
                    path:`${path}${(routers[router].path) ? `/${routers[router].path}`: ""}`,
                    method: routers[router].method
                }
            })
        };
    }

    private setConnection() {
        this.router.addRoute("GET", "/", () => {
            return new Response(this.RouterConnect, 200);
        });
    }
}
