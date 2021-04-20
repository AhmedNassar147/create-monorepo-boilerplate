import { render } from "react-dom";
import BaseAppWrapper from "@domain/base-app-wrapper";
import AppRouter from "./routes";

console.log("BUILD_YEAR", BUILD_YEAR);

const App = () => (
  <BaseAppWrapper>
    <AppRouter />
  </BaseAppWrapper>
);

render(<App />, document.getElementById("root"));
