/*
 *
 * Types: `@domain/react-lazy`.
 *
 */
export default interface IProps {
  shouldMountChunk: boolean;
  fallback?: React.ReactNode;
  [key: string]: unknown;
}
