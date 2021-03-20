import { render } from "react-dom";
import Component from "@domain/pkg1";
import Second from "@domain/pkg2";
import SecondA from "@domain/pkg3";

console.log("process.env.BUILD_YEAR", process.env);

const App = () => (
  <>
    <SecondA />
    <Component name="1" />
    <Second />
    <div>APP</div>
  </>
);

render(<App />, document.getElementById("root"));
