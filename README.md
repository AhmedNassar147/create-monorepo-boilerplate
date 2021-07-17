# First installation ?

## Note: Please checkout the `engines` property in [package.json](./package.json)

```sh
 make sure you have globally the required engines/versions installed.
```

## Please also install the following globally on your machine.

```sh
 - lerna ">= 3.20.2".
 - typescript ">= 4.1.4"
```

## Getting installation started.

```sh
- yarn bootstrap (after finished) .
```

## yarn bootstrap

```sh
  It will install the required dependencies / bins for the project and builds the packages .
```

## yarn link-bins

```sh
  It will link the internal cli bins to your global machine bins so you can access them
  link `validate-packages-deps --h`.
```

## Linking the (validate-packages-deps)

```sh
- It will symlink the package `bin` to the global `bins` on your machine so you can use
  the `cli` globally across the project you can also see how to use it by running
  `validate-packages-deps --h` in your terminal.
- the package will validate the packages and modules dependencies along with typescript references.
```

## Linking the (validate-packages-assets)

```sh
- It will symlink the package `bin` to the global `bins` on your machine so you can use
  the `cli` globally across the project you can also see how to use it by running
  `validate-packages-assets --h` in your terminal.
- the package will validate the packages and modules assets.
```

## Linking the (precommit-linter)

```sh
- It will symlink the package `bin` to the global `bins` on your machine so you can use
  the `cli` globally across the project you can run `precommit-linter` in your terminal.
- the package will prettify, linting and validate dependencies staged files only if you
  want to include also unstaged files run `yarn lint:modified`
```

## Linking the (prepush-linter)

```sh
- It will symlink the package `bin` to the global `bins` on your machine so you can use
  the `cli` globally across the project you can run `prepush-linter` in your terminal.
- the package will prettify, linting, validate dependencies if current branch is `master`.
```

## Linking the (validate-app-assets)

```sh
- It will symlink the package `bin` to the global `bins` on your machine so you can use
  the `cli` globally across the project you can also see how to use it by running
  `validate-app-assets --h` in your terminal.
- the package will validate the current app assets from it's routes data config up
  to their dependencies by checking `assetsPaths` in their package.json file.
```

## Linking the (post-whatsapp-build-message)

```sh
- It will symlink the package `bin` to the global `bins` on your machine so you can use
  the `cli` globally across the project.
- the package post zip the build folder and upload it to 'https://file.io'
  then will post a message to whatsapp with build info and downloadable file link.
```

---

# Project overview

## What is `packages` folder

```sh
The `packages` folder is the one that have the `sharable/reusable` packages across the project.
```

## What are `modules` folders

```sh
A `module` is a folder that contains pages/components are only rendered in current module.
```

## What are `apps` folders

```sh
An `app` can contain packages and modules to render pages on the browser.
```

## What is the `devpackages` folder

```sh
The `devpackages` contains packages like `clis` eg. `validate-packages-deps`.
```

## `workspaces` folder

```sh
contains helper functions to deal with yarn workspaces  packages .
```

## `scripts` folder

```sh
contains helper functions to deal with node js processes.
```

## `command-line-utils` folder

```sh
contains helper functions to deal/create a `cli` .
```

## `babel` folder

```sh
contains configured babel presets/plugins to compile packages / apps (with webpack) .
```
