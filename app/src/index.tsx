/*
 *
 * Index: `@domain/app`.
 *
 */
import { render } from "react-dom";
import App from "@domain/base-app-wrapper";
import pagesRoutesData from "./pagesRoutesData";

render(<App routesData={pagesRoutesData} />, document.getElementById("root"));
