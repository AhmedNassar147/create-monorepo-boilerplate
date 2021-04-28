/*
 *
 * Component: `MaleIcon`.
 *
 */
import { memo } from "react";
import { BaseSvgProps } from "@domain/types";

const MaleIcon: React.FC<BaseSvgProps> = ({
  color,
  onClick,
  className,
  style,
  width,
  height,
}) => (
  <svg
    width={width}
    height={height}
    className={className}
    style={style}
    onClick={onClick}
  >
    <path
      fill={color}
      fillRule="evenodd"
      d="M14.013 2.333h-1.788V0H18v5.871h-2.288V4.049l-2.429 2.468c.155.223.341.471.507.731.962 1.506 1.345 3.162 1.161 4.938-.198 1.908-1.008 3.519-2.401 4.82a7.215 7.215 0 01-3.668 1.859c-1.71.317-3.35.078-4.887-.747-1.452-.78-2.541-1.933-3.255-3.441a7.517 7.517 0 01-.698-4.065c.197-1.884.977-3.485 2.338-4.788 1.03-.985 2.242-1.628 3.626-1.901 1.843-.363 3.594-.077 5.233.87.309.178.214.202.472-.06l2.162-2.192c.052-.052.117-.091.175-.136l-.035-.072zm-11.71 9.034c-.01 2.915 2.313 5.283 5.188 5.288 2.864.005 5.194-2.328 5.198-5.253.004-2.937-2.285-5.274-5.185-5.292-2.852-.018-5.191 2.353-5.201 5.257z"
    />
  </svg>
);

MaleIcon.defaultProps = {
  width: "19",
  height: "20",
  color: "currentcolor",
};

export default memo(MaleIcon);
