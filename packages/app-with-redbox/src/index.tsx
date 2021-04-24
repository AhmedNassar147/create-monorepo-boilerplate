/*
 *
 * Package: `@domain/app-with-redbox`.
 *
 */
import { render } from "react-dom";

const root = document.getElementById("root");

const renderAppWithRedBox = (app: JSX.Element) => {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line
    const RedBox = require("redbox-react").default;
    try {
      render(app, root);
    } catch (e) {
      render(<RedBox error={e} />, root);
    }
  } else {
    render(app, root);
  }
};

export default renderAppWithRedBox;
