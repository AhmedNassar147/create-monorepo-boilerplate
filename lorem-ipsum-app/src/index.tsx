/*
 *
 * Index: `@domain/lorem-ipsum-app`.
 *
 */
import renderAppWithRedBox from "@domain/app-with-redbox";
import App from "@domain/base-app-wrapper";
import pagesRoutesData from "./pagesRoutesData";

renderAppWithRedBox(<App routesData={pagesRoutesData} />);
