/*
 *
 * Package: `@domain/labels-provider`.
 *
 */
import React from "react";
import { RecordType } from "@domain/types";
import Store from "./context";
import IProps from "./index.interface";

const LabelsProvider: React.FC<IProps> = ({ children }): JSX.Element => {
  const [state] = React.useState<RecordType>({});
  return <Store.Provider value={state}>{children}</Store.Provider>;
};

export default LabelsProvider;
export { default as usePageLabelsContext } from "./usePageLabelsContext";
export { default as useTranslatedId } from "./useTranslatedId";
export { default as useTranslateIdFactory } from "./useTranslateIdFactory";
export { default as useTranslateLabelsIds } from "./useTranslateLabelsIds";
