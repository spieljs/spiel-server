import { Road } from "roads";

export type Keys = string;
export type EndpointsConnect = IEndpoints[];
export type IBody = any;

export interface IEndpoint {
  [key: string]: any;
}

export interface IRouteMethod {
  path: string;
  method: string;
}

export interface IRouteProps {
  path: string;
  method: string;
  name: string;
}

export interface IEndpoints {
  name: string;
  props: IRouteProps[];
}

export interface IRoute {
  [key: string]: IRouteMethod;
}

/**
 * Router options
 */
export interface IRouterOptions {
  /**
   * create a root endpoint which return all the rest endpoint with its methods
   * @default true
   */
  connectionMode?: boolean;
  /**
   * All the endpoints for this router
   */
  endpoints: any[];
  /**
   * Object to build the router
   * @see <a href="https://github.com/Dashron/roads">roads</a>
   */
  road: Road;
  /**
   * Show all the routers and request in server console
   * @default false
   */
  verbose?: boolean;
}
