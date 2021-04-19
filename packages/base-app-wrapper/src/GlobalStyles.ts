/*
 *
 * `GlobalStyles`: `@domain/base-app-wrapper`.
 *
 */
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  html {
    box-sizing: border-box;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    -ms-overflow-style: scrollbar;
    -webkit-tap-highlight-color: transparent;
    font-size: 62.5%;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    font-family: Work Sans;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: #f2f2f2;
    font-family: 'Work Sans', sans-serif;
  }

  h1, h2, h3, p {
    margin-top: 0;
    margin-bottom: 0;
    font-family: Work Sans;
  }

  svg {
    overflow: hidden;
  }
`;

export default GlobalStyles;
