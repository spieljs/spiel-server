export type Keys = string;
export type RouteConnect = IRouteClasses[];

export interface IRouter {
    [key: string]: any;
}

export interface IRouteMethod {
    path: string;
    method: string;
    name?: string;
    target?: any;
}

export interface IRouteProps {
    path: string;
    method: string;
    name: string;
}

export interface IRouteClasses {
    name: string;
    props: IRouteProps[];
}

export interface IRoute {
    [key: string]: IRouteMethod;
}