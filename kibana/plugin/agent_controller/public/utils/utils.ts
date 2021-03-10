import _times from "lodash/times";

// wrap the lodash functions to avoid having lodash's TS type definition from being
// exported, which can conflict with the lodash namespace if other versions are used

export function times<T>(count: number, iteratee?: (index: number) => T) {
  if (iteratee === undefined) {
    return _times(count);
  }
  return _times(count, iteratee);
}
