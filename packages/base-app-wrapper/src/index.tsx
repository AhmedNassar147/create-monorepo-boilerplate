/*
 *
 * Package: `@domain/base-app-wrapper`.
 *
 */
import { BrowserRouter } from "react-router-dom";
import LabelsProvider from "@domain/labels-provider";
import BasePage from "@domain/base-page";
import { ParentProps } from "@domain/types";

const BaseAppWrapper = ({ children }: ParentProps) => (
  <BrowserRouter basename="/">
    <LabelsProvider>
      <BasePage>{children}</BasePage>
    </LabelsProvider>
  </BrowserRouter>
);

export default BaseAppWrapper;
