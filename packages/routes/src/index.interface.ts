/*
 *
 * Types: `@domain/routes`.
 *
 */
import { KeysOfRecord } from "@domain/types";
import PagesPathNames from "./pagesPathNames";

export type PATH_TYPE = string | string[];

export type PAGES_NAMES_KEYS_TYPE = KeysOfRecord<typeof PagesPathNames>;

export type PAGES_NAMES_TYPES = typeof PagesPathNames;
