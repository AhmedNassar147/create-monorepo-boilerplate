/*
 *
 * `pagesRoutesData`: `@domain/lorem-ipsum-app`.
 *
 */
import { lazy } from "react";
import { PAGES_PATH_NAMES, RouteItemDataType } from "@domain/routes";

const PAGES_ROUTER_DATA: RouteItemDataType[] = [
  {
    path: PAGES_PATH_NAMES.loremIpsum,
    lazyPageComponent: lazy(
      () =>
        import(
          "@domain/lorem-ipsum-page" /* webpackChunkName: "domain.lorem-ipsum-page" */
        ),
    ),
  },
  {
    path: PAGES_PATH_NAMES.someNew,
    lazyPageComponent: lazy(
      () =>
        import(
          "@domain/some-new-page" /* webpackChunkName: "domain.some-new-page" */
        ),
    ),
  },
];

export default PAGES_ROUTER_DATA;
