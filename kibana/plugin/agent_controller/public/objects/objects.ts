import _get from "lodash/get";

// wrap the lodash functions to avoid having lodash's TS type definition from being
// exported, which can conflict with the lodash namespace if other versions are used

export const get = (object: {}, path: string[] | string, defaultValue?: any) =>
  _get(object, path, defaultValue);
