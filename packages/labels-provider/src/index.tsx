/*
 *
 * Package: `@domain/labels-provider`.
 *
 */
import { FC, useState } from "react";
import { RecordType } from "@domain/types";
import Store from "./context";
import IProps from "./index.interface";

const LabelsProvider: FC<IProps> = ({ children }): JSX.Element => {
  const [state] = useState<RecordType>({});
  return <Store.Provider value={state}>{children}</Store.Provider>;
};

export default LabelsProvider;
