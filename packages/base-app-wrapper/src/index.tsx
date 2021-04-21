/*
 *
 * Package: `@domain/base-app-wrapper`.
 *
 */
import { Suspense, memo } from "react";
import SuspenseFallBack from "@domain/loader-fallback";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LabelsProvider from "@domain/labels-provider";
import BasePage from "@domain/base-page";
import GlobalStyles from "./GlobalStyles";
import IProps from "./index.interface";

const BaseAppWrapper = ({ routesData }: IProps) => (
  <>
    <GlobalStyles />
    <BrowserRouter basename="/">
      <LabelsProvider>
        <BasePage>
          <Suspense fallback={<SuspenseFallBack />}>
            <Switch>
              {routesData.map(({ path, loadPageComponent }) => {
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
        </BasePage>
      </LabelsProvider>
    </BrowserRouter>
  </>
);

export default memo(BaseAppWrapper);
