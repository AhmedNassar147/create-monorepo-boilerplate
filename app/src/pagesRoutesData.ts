/*
 *
 * `pagesRoutesData`: `@domain/app`.
 *
 */
import { PAGES_PATH_NAMES, RouteItemDataType } from "@domain/routes";

const PAGES_ROUTER_DATA: RouteItemDataType[] = [
  {
    path: PAGES_PATH_NAMES.loremIpsum,
    loadPageComponent: () => require("@domain/lorem-ipsum-page"),
  },
];

export default PAGES_ROUTER_DATA;
