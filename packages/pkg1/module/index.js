import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

/*
 *
 * Package:  `@domain/pkg1`.
 *
 */
console.log("BUILD_YEAR @domain/pkg1", BUILD_YEAR);

var ReactComponent = (_ref) => {
  var {
    name
  } = _ref;
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx("p", {
      children: name
    }), /*#__PURE__*/_jsx("p", {
      children: "hello from package @domain/pkg1"
    }), /*#__PURE__*/_jsx("p", {
      children: name
    }), /*#__PURE__*/_jsx("p", {
      children: name
    })]
  });
};

export default ReactComponent;