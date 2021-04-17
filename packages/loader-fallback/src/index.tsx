/*
 *
 * Package: `@domain/loader-fallback`.
 *
 */
import { memo } from "react";
import FallbackWrapper from "./styled";
import IProps from "./index.interface";

const LoaderFallBack: React.FC<IProps> = ({ ...props }) => (
  <FallbackWrapper {...props}>
    <p>loading...</p>
  </FallbackWrapper>
);

// LoaderFallBack.defaultProps = {
//   spinnerSize: "large",
// };

export default memo(LoaderFallBack);
