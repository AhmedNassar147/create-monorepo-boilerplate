/*
 *
 * `createTsReferences`: `utils`
 *
 */
const createTsReferences = ({
  isLazy,
  useLabelsHooks,
  isCurrentPackageInPackages,
}) => {
  let refs = [];

  let basePath = "..";

  if (!isCurrentPackageInPackages) {
    basePath += "/../packages";
  }

  if (useLabelsHooks) {
    refs.push({
      path: `${basePath}/labels-provider`,
    });
  }

  if (isLazy) {
    refs.push({
      path: `${basePath}/react-lazy`,
    });
  }

  return refs.length ? JSON.stringify(refs) : false;
};

module.exports = createTsReferences;
