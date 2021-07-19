/*
 *
 * Package: `@domain/app-with-redbox`.
 *
 */
import { render } from "react-dom";

const renderAppWithRedBox = (app: JSX.Element) => {
  const root = document.getElementById("root");

  if (!IS_PRODUCTION) {
    // eslint-disable-next-line
    const RedBox = require("redbox-react").default;
    try {
      render(app, root);
    } catch (error) {
      render(<RedBox error={error} />, root);
    }
  } else {
    render(app, root);
  }
};

export default renderAppWithRedBox;
