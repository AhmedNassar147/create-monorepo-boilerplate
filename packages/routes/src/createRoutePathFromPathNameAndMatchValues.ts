/*
 *
 * `createRoutePathFromPathNameAndMatchValues`: `@domain/routes`.
 *
 */
import { RecordType } from "@domain/types";
import PagesPathNames from "./pagesPathNames";
import {
  PAGES_NAMES_KEYS_TYPE,
  PATH_TYPE,
  PAGES_NAMES_TYPES,
} from "./index.interface";

const variableInStringRegex = /:\w*\??/g;
// const optionalCharactersInStringRegEx = /\w*\?/g;
const requiredOrOptionalCharactersInStringRegEx = /:|\?/g;

const replacePathNameString = (
  pathName: string,
  values: RecordType<string | number | undefined>,
) => {
  let pathNameResult = pathName;

  const variablesMatchArray = pathName.match(variableInStringRegex);

  if (Array.isArray(variablesMatchArray)) {
    variablesMatchArray.forEach((paramWithCharacter) => {
      // const isOptionalParam = optionalCharactersInStringRegEx.test(
      //   paramWithCharacter
      // );

      const actualParam = paramWithCharacter.replace(
        requiredOrOptionalCharactersInStringRegEx,
        "",
      );

      const paramValue = (values[actualParam] || "").toString();

      pathNameResult = pathNameResult.replace(paramWithCharacter, paramValue);
    });
  }

  return pathNameResult;
};

const createRoutePathFromPathNameAndMatchValues = <
  T extends PAGES_NAMES_KEYS_TYPE
>(
  pageNameKey: T,
  values: RecordType<string | number | undefined>,
): PAGES_NAMES_TYPES[T] => {
  const pagePathName: string | string[] = PagesPathNames[
    pageNameKey
  ] as PATH_TYPE;

  if (Array.isArray(pagePathName)) {
    return pagePathName.map((pathName) =>
      replacePathNameString(pathName, values),
    ) as PAGES_NAMES_TYPES[T];
  }

  return replacePathNameString(pagePathName, values) as PAGES_NAMES_TYPES[T];
};

export default createRoutePathFromPathNameAndMatchValues;
