/*
 *
 * Index: `Routes`.
 *
 */
import { Suspense, memo } from "react";
import { Route, Switch } from "react-router-dom";
import SuspenseFallBack from "@domain/loader-fallback";
import pagesRoutesData from "./pagesRoutesData";

const Routes = () => (
  <Suspense fallback={<SuspenseFallBack />}>
    <Switch>
      {pagesRoutesData.map(({ path, loadPageComponent }) => {
        const LazyLoadedPage = loadPageComponent().default;

        return (
          <Route
            path={path}
            exact
            key={path.toString()}
            component={LazyLoadedPage}
          />
        );
      })}
    </Switch>
  </Suspense>
);

export default memo(Routes);
