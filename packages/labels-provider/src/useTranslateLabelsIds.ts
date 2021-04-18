/*
 *
 * `useTranslateLabelsIds`: `@app-structure/labels-provider`.
 *
 */

import { useMemo } from "react";
import useTranslateIdFactory from "./useTranslateIdFactory";

const useTranslateLabelsIds = <K extends string>(
  labelsId: K[],
): Record<K, string> => {
  const translateLabel = useTranslateIdFactory();

  return useMemo((): Record<K, string> => {
    // @ts-ignore: `labelsId` will always be object.
    return labelsId.reduce((previous: Record<K, string>, labelId: K) => {
      // @ts-ignore: we know this will always return the proper value.
      previous[labelId] = translateLabel(labelId as string);
      return previous;
    }, {});
  }, [labelsId, translateLabel]);
};

export default useTranslateLabelsIds;
