/*
 *
 * Package: `@domain/lorem-ipsum`.
 *
 */
import { memo } from "react";

// Remove `memo` if your component uses `children`.
// @see {@link https://reactjs.org/docs/react-api.html#reactmemo}.
const LoremIpsum = () => {
  return <div>LoremIpsum</div>;
};

export default memo(LoremIpsum);
