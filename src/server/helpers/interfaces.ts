import { Cors, Road } from "roads";

export type Keys = string;
export type EndpointsConnect = IEndpoints[];
export type IEndpoint = IObject;

export interface IObject {
  [key: string]: any;
}

export interface IUrl {
  args: IObject;
  hash: string;
  host: string | null;
  hostname: string | null;
  href: string;
  path: string;
  pathName: string;
  port: string | null;
  protocol: string | null;
  query: IObject;
  search: string | null;
  slashes: string | null;
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
   * It allow Cross-origin
   * @see <a href="https://github.com/Dashron/roads" target="https://github.com/Dashron/roads#corsobject-options">
   * cors</a>
   */
  cors?: Cors;
  /**
   * All the endpoints for this router
   */
  endpoints: any[];
  /**
   * Object to build the router
   * @see <a href="https://github.com/Dashron/roads" target="_blank">roads</a>
   */
  road: Road;
  /**
   * Show all the routers and request in server console
   * @default false
   */
  verbose?: boolean;
}
