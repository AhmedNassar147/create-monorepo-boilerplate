/*
 *
 * Package: `@domain/types`.
 *
 */
export type RecordType<T = string> = Record<string, T>;

export interface ParentProps {
  children?: React.ReactNode;
}

export type KeysOfRecord<T> = keyof T;

/**
 * USAGE
 * ```typescript.
 *  const someObject = { name: "ahmed", name2: "nassar" } as const;
 *  type options = ValuesOfRecordAsOptions<typeof someObject>;
 *  options would be "ahmed" | "nassar"
 * ```
 */
export type ValuesOfRecordAsOptions<T> = T[KeysOfRecord<T>];
