/*
 *
 * `collectBinsPackages`: `@domain/install-bins`.
 *
 */
const { join } = require("path");
const { readdirSync } = require("fs");
const { readJsonFileSync } = require("../../scripts");

const alreadyKnowPackagesToNotBeCLis =
  /webpack|babel|environment|eslint-config|generators|install-bins|command-line-utils|package-builder|scripts|assets-helpers/;

const collectBinsPackages = () => {
  const devpackagesPath = join(__dirname, "../../");

  const allFoldersNames = readdirSync(devpackagesPath, {
    encoding: "utf8",
  }).filter((folderName) => !alreadyKnowPackagesToNotBeCLis.test(folderName));

  if (allFoldersNames.length) {
    const packagesWithBinsData = allFoldersNames
      .map((packageFolderName) => {
        const { name, bin } = readJsonFileSync(
          join(devpackagesPath, packageFolderName, "package.json"),
          true,
        );

        const binNames = Object.keys(bin);
        const binLength = binNames.length;

        if (bin && !!binLength) {
          return {
            binNames,
            packageName: name,
            packageFolderName,
          };
        }

        return false;
      })
      .filter(Boolean);

    return packagesWithBinsData;
  }

  return false;
};

module.exports = collectBinsPackages;
