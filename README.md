# First installation ?

## Note: Please checkout the `engines` property in [package.json](./package.json) and make sure you have globally the required engines/versions installed.

## Please also install the following globally on your machine.

```sh
 - lerna ">= 3.20.2".
 - typescript ">= 4.1.4"
```

## Getting installation started.

```sh
- yarn bootstrap (after finished) .
- `cd devpackages/package-builder` and in your terminal run `npm link` .
```

## yarn bootstrap

```sh
It will install the required dependencies for the project.
```

## Linking the (package-builder)

```sh
It will symlink the package `bin` to the global `bins` on your machine so you can use
the `cli` globally across the project you can also see how to use it by running `package-builder --h` in your terminal.
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
The `devpackages` contains packages like `clis` eg. `package-builder`.
```

## `package-builder` cli

```sh
It builds/watches changed files in specified packages and compile it with babel.
```

## What is the `internals` folder

```sh
The `internals` folder contains utilities like helpers to control the process (webpack / generators / nodejs process) .
```

---

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
