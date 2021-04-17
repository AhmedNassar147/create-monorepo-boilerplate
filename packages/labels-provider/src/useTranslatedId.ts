/*
 *
 * `useTranslatedId`: `@domain/labels-provider`.
 *
 */
import { useMemo } from "react";
import usePageLabelsContext from "./usePageLabelsContext";

const useTranslatedId = (labelId: React.ReactNode) => {
  const labels = usePageLabelsContext();

  const translatedLabel = useMemo(() => {
    if (typeof labelId === "string" && labelId) {
      return labels[labelId] || labelId;
    }
    return labelId;
  }, [labels, labelId]);

  return translatedLabel;
};

export default useTranslatedId;
