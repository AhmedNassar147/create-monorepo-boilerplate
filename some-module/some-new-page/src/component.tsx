/*
 *
 * `SomeNew`: `@domain/some-new-page`.
 *
 */
import { memo } from "react";

// Remove `memo` if your component uses `children`.
// @see {@link https://reactjs.org/docs/react-api.html#reactmemo}.
const SomeNew = () => {
  return <div>SomeNew</div>;
};

export default memo(SomeNew);
