/*
 *
 * Index: `@domain/app`.
 *
 */
import renderAppWithRedBox from "@domain/app-with-redbox";
import App from "@domain/base-app-wrapper";
import pagesRoutesData from "./pagesRoutesData";

console.log("IS_PRODUCTION", IS_PRODUCTION);
renderAppWithRedBox(<App routesData={pagesRoutesData} />);
