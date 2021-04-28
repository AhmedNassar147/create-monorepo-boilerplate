/*
 *
 * SomePage: `App`.
 *
 */
import { memo } from "react";
import { MaleIcon } from "@domain/jsx-icons";
import imageSrc from "../assets/addUser.svg";

const SomePage = () => {
  return (
    <div>
      <h1>login page</h1>

      <img src={imageSrc} />
      <br />
      <MaleIcon />
    </div>
  );
};
export default memo(SomePage);
