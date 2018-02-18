import { middleware, Response, Road} from "roads";
import { IRouteClasses, IRouteMethod, IRouter, RouteConnect} from "./helpers/interfaces";

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
            route.router.forEach((props: IRouteMethod) => {
                if (props.name) {
                    this.router.addRoute(props.method, props.path, route.constructor.prototype[props.name]);
                }
            });
            this.RouterConnect.push(this.setRouterConnect(route));
        });
    }

    private setRouterConnect(route: IRouter): IRouteClasses {
        return {
            name: route.constructor.name,
            props: route.router.map((prop: IRouteMethod) => {
                return {
                    method: prop.method,
                    name: prop.name,
                    path: prop.path,
                };
            }),
        };
    }

    private setConnection() {
        this.router.addRoute("GET", "/", () => {
            return new Response(this.RouterConnect, 200);
        });
    }
}
