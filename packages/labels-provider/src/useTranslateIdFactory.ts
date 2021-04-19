/*
 *
 * `useTranslateIdFactory`: `@app-structure/labels-provider`.
 *
 */
import { useCallback } from "react";
import usePageLabelsContext from "./usePageLabelsContext";

const useTranslateIdFactory = () => {
  const labels = usePageLabelsContext();

  const translateLabel = useCallback(
    (labelId: React.ReactNode) => {
      if (typeof labelId === "string" && labelId) {
        return labels[labelId] || labelId;
      }
      return labelId;
    },
    [labels],
  );

  return translateLabel;
};

export default useTranslateIdFactory;
