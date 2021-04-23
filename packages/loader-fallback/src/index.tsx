/*
 *
 * Package: `@domain/loader-fallback`.
 *
 */
import { memo } from "react";

const LoaderFallBack = () => (
  <div
    css={`
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      width: inherit;
      min-height: inherit;
      max-height: inherit;
    `}
  >
    <p>loading...</p>
  </div>
);

export default memo(LoaderFallBack);
