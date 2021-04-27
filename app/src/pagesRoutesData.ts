/*
 *
 * `pagesRoutesData`: `@domain/app`.
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
    path: PAGES_PATH_NAMES.login,
    lazyPageComponent: lazy(
      () => import("./pages/somePage" /* webpackChunkName: "pages.somePage" */),
    ),
  },
];

export default PAGES_ROUTER_DATA;
