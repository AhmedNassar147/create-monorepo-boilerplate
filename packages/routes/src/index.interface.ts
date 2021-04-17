/*
 *
 * Types: `@domain/routes`.
 *
 */
import { KeysOfRecord } from "@domain/types";
import PagesPathNames from "./pagesPathNames.json";

export type PATH_TYPE = string | string[];

export type PAGES_NAMES_KEYS_TYPE = KeysOfRecord<typeof PagesPathNames>;

export type PAGES_NAMES_TYPES = typeof PagesPathNames;

export type RouteItemDataType = {
  path: string | string[];
  loadPageComponent: () => {
    default: React.LazyExoticComponent<
      React.MemoExoticComponent<() => JSX.Element>
    >;
  };
};
