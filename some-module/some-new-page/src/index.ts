/*
 *
 * Package: `@domain/some-new-page`.
 *
 */
import { lazy } from "react";

export default lazy(
  () => import("./component" /* webpackChunkName: "domain.some-new-page" */),
);
