/*
 *
 * SomePage: `App`.
 *
 */
import { memo } from "react";
import { MaleIcon } from "@domain/jsx-icons";
import { Link } from "react-router-dom";

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

      <br />

      <Link
        to="/loremIpsum"
        css={`
          color: white;
          font-size: 20px;
        `}
      >
        lorem ipsum page
      </Link>
    </div>
  );
};
export default memo(SomePage);
