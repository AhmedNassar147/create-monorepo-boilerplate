// /*
//  *
//  * `selectPagesFromModules`: `workspaces`
//  *
//  */
// const getWorkSpacesData = require("./getWorkSpacesData");
// // const readJsonFileSync = require("../scripts/readJsonFileSync");
// // const readJsonFile = require("../scripts/readJsonFile");

// const selectPagesFromModules = (modulesNames) => {
//   const modulesNamesRegex = new RegExp(`\\b${modulesNames.join("|")}\\b`);

//   const workSpacesData = getWorkSpacesData({
//     onlyTheseWorkSpacesNamesRegex: modulesNamesRegex,
//     onlyPages: true,
//   });

//   // const packagesFromModulesKeys = Object.keys(workSpacesData);

//   // const packagesDataFromModulesPromises = packagesFromModulesKeys.map(
//   //   async (packageName) => {
//   //     const {
//   //       packagePath,
//   //       dependencies,
//   //       peerDependencies,
//   //       routeData,
//   //     } = workSpacesData[packageName];

//   //     if (modulesNamesRegex.test(packagePath)) {
//   //       if (routeData) {
//   //         return {
//   //           packageName,
//   //           dependencies,
//   //           peerDependencies,
//   //           routeData,
//   //         };
//   //       }
//   //       return false;
//   //     }

//   //     return false;
//   //   },
//   // );

//   // const packagesDataFromModules = (
//   //   await Promise.all(packagesDataFromModulesPromises)
//   // ).filter(Boolean);

//   // const normalizedModulesPackages = packagesDataFromModules.reduce(
//   //   (acc, { packageName, dependencies, peerDependencies, routeData }) => {
//   //     acc = {
//   //       ...acc,
//   //       packages: [...acc.packages, packageName],
//   //       dependencies: {
//   //         ...acc.dependencies,
//   //         ...(dependencies || {}),
//   //       },
//   //       peerDependencies: {
//   //         ...acc.peerDependencies,
//   //         ...(peerDependencies || {}),
//   //       },
//   //       pages: {
//   //         ...acc.pages,
//   //         [packageName]: routeData,
//   //       },
//   //     };
//   //     return acc;
//   //   },
//   //   {
//   //     packages: [],
//   //     dependencies: {},
//   //     peerDependencies: {},
//   //     pages: {},
//   //   },
//   // );

//   // const {
//   //   packages,
//   //   dependencies,
//   //   peerDependencies,
//   //   pages,
//   // } = normalizedModulesPackages;

//   // const dependenciesKeys = Object.keys(dependencies);

//   const packagesKeys = Object.keys(workSpacesData);

//   return packagesKeys.map((packageName) => {
//     const { routeData } = workSpacesData[packageName];
//     return {
//       routeData,
//       name: packageName,
//     };
//   });
// };

// module.exports = selectPagesFromModules;
