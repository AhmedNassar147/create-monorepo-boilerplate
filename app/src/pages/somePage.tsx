/*
 *
 * SomePage: `App`.
 *
 */
import { memo } from "react";
import imageSrc from "../assets/addUser.svg";

const SomePage = () => {
  return (
    <div>
      <h1>login page</h1>

      <img src={imageSrc} />
    </div>
  );
};
export default memo(SomePage);
