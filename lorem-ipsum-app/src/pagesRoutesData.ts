/*
 *
 * `pagesRoutesData`: `@domain/lorem-ipsum-app`.
 *
 */
import { PAGES_PATH_NAMES, RouteItemDataType } from "@domain/routes";

const PAGES_ROUTER_DATA: RouteItemDataType[] = [
  {
    path: PAGES_PATH_NAMES.loremIpsum,
    loadPageComponent: () => require("@domain/lorem-ipsum-page"),
  },
  {
    path: PAGES_PATH_NAMES.someNew,
    loadPageComponent: () => require("@domain/some-new-page"),
  },
];

export default PAGES_ROUTER_DATA;
