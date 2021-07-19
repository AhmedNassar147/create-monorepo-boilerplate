/*
 *
 * SomePage: `App`.
 *
 */
import { memo } from "react";
import { MaleIcon } from "@domain/jsx-icons";

const SomePage = () => {
  return (
    <div>
      <h1
        css={`
          color: green;
        `}
      >
        login page
      </h1>

      <img src="assets/addUser.svg" />
      <br />
      <MaleIcon />
    </div>
  );
};
export default memo(SomePage);
