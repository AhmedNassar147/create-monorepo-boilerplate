/*
 *
 * `pagesRoutesData`: `Routes`.
 *
 */
import { PAGES_PATH_NAMES, RouteItemDataType } from "@domain/routes";

const PAGES_ROUTER_DATA: RouteItemDataType[] = [
  {
    path: PAGES_PATH_NAMES.ahmed,
    loadPageComponent: () => require("@domain/ahmed-page"),
  },
  {
    path: PAGES_PATH_NAMES.loremIpsum2,
    loadPageComponent: () => require("@domain/lorem-ipsum-2-page"),
  },
  {
    path: PAGES_PATH_NAMES.loremIpsum,
    loadPageComponent: () => require("@domain/lorem-ipsum-page"),
  },
  {
    path: PAGES_PATH_NAMES.new,
    loadPageComponent: () => require("@domain/new-page"),
  },
  {
    path: PAGES_PATH_NAMES.someName,
    loadPageComponent: () => require("@domain/some-name-page"),
  },
  {
    path: PAGES_PATH_NAMES.someX,
    loadPageComponent: () => require("@domain/some-x-page"),
  },
  {
    path: PAGES_PATH_NAMES.xxXx,
    loadPageComponent: () => require("@domain/xx-xx-page"),
  },
];

export default PAGES_ROUTER_DATA;
