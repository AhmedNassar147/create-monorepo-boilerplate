/*
 *
 * Package: `@domain/react-lazy`.
 *
 */
import { lazy, Suspense, forwardRef, MutableRefObject } from "react";
import IProps from "./index.interface";

const DEFAULT_FALLBACK = null;

const createLazyLoadedComponent = (
  importFunction: () => Promise<{
    default:
      | React.ComponentType<unknown>
      | React.MemoExoticComponent<() => JSX.Element>;
  }>,
): JSX.Element => {
  const LazyLoadedComponent = lazy(importFunction);

  const LazyComponent = (
    { fallback, shouldMountChunk, ...props }: IProps,
    ref: MutableRefObject<unknown>,
  ) => (
    <Suspense fallback={fallback || DEFAULT_FALLBACK}>
      {shouldMountChunk && (
        <LazyLoadedComponent
          {...props}
          // @ts-ignore: ignore for now
          ref={ref}
        />
      )}
    </Suspense>
  );

  // @ts-ignore: forwardRef is not generic
  return forwardRef(LazyComponent);
};

export default createLazyLoadedComponent;
