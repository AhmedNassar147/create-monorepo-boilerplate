/*
 *
 * Styled: `@domain/loader-fallback`.
 *
 */
import styled from "styled-components";
import IProps from "./index.interface";

const FallbackWrapper = styled.div<IProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: ${({ width }) => width};
  ${({ height }) => `
    min-height: ${height};
    max-height: ${height};
  `};
  ${({ overlay }) =>
    overlay &&
    `
    background-color: rgba(0, 0, 0, 0.03);
    z-index: 10000;
  `};
`;

FallbackWrapper.defaultProps = {
  width: "inherit",
  height: "inherit",
};

export default FallbackWrapper;
