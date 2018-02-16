import { middleware, Response, Road} from "roads";
import { IRouteClasses, IRouteMethod, IRouter, RouteConnect} from "./helpers/interfaces";

export class SetRouter {
    protected routes: IRouter[];
    protected router: middleware.SimpleRouter;
    protected RouterConnect!: RouteConnect;

    constructor(routes: IRouter[], road: Road) {
        this.routes = routes;
        this.router = new middleware.SimpleRouter(road);
        this.getRoutes();
        this.setConnection();
    }

    private getRoutes() {
        this.routes.forEach((route) => {
            route.route.forEach((props: IRouteMethod) => {
                this.router.addRoute(props.method, props.path, route[Object.keys(props)[0]]);
            });
            this.RouterConnect.push(this.setRouterConnect(route));
        });
    }

    private setRouterConnect(route: IRouter): IRouteClasses {
        return {
            name: route.constructor.name,
            props: Object.keys(route).map((prop) => {
                return {
                    method: route[prop].method,
                    name: prop,
                    path: route[prop].path,
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
