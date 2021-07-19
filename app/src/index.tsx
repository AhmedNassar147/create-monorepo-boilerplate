/*
 *
 * Index: `@domain/app`.
 *
 */
import renderAppWithRedBox from "@domain/app-with-redbox";
import App from "@domain/base-app-wrapper";
import pagesRoutesData from "./pagesRoutesData";

renderAppWithRedBox(<App routesData={pagesRoutesData} />);

if (IS_PRODUCTION) {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
}
