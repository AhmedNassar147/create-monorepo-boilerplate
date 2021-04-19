import { render } from "react-dom";
import BaseAppWrapper from "@domain/base-app-wrapper";

console.log("BUILD_YEAR", BUILD_YEAR);

const App = () => (
  <BaseAppWrapper>
    <div>APP</div>
  </BaseAppWrapper>
);

render(<App />, document.getElementById("root"));
