/*
 *
 * `useTranslateLabelsIds`: `@app-structure/labels-provider`.
 *
 */

import { useMemo } from "react";
import useTranslateIdFactory from "./useTranslateIdFactory";

const useTranslateLabelsIds = <K extends string>(labelsId: K[]) => {
  const translateLabel = useTranslateIdFactory();

  return useMemo((): Record<K, string> => {
    // @ts-ignore
    return labelsId.reduce((previous: Record<K, string>, labelId: K) => {
      let newIdsData: Record<K, string> = previous;

      // @ts-ignore
      newIdsData[labelId] = translateLabel(labelId);
      return newIdsData;
    }, {});
  }, [labelsId, translateLabel]);
};

export default useTranslateLabelsIds;
