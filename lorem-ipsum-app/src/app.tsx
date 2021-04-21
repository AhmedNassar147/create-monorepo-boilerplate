/*
 *
 * App: `@domain/lorem-ipsum-app.`
 *
 */
import { memo } from "react";
import BaseAppWrapper from "@domain/base-app-wrapper";

const App = () => (
  <>
    <BaseAppWrapper>
      <div>APP</div>
    </BaseAppWrapper>
  </>
);

export default memo(App);
