/*
 *
 * Package: `@domain/base-page`.
 *
 */
import { FC } from "react";
import { ParentProps } from "@domain/types";

const BasePage: FC<ParentProps> = ({ children }) => (
  <>
    <header
      css={`
        height: 60px;
        background-color: green;
        width: 100%;
        line-height: 1.5;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <p
        css={`
          text-align: center;
          font-size: 18px;
          font-weight: bold;
        `}
      >
        App Header
      </p>
    </header>
    <main
      css={`
        width: 100%;
        max-width: 100%;
        min-height: calc(100vh - 60px);
        max-height: calc(100vh - 60px);
        background-color: blue;
        overflow-y: auto;
        overflow-x: hidden;
        line-height: 1.5;
      `}
    >
      {children}
    </main>
  </>
);

export default BasePage;
