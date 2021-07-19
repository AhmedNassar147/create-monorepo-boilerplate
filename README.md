## Note: Please checkout the `engines` property in [package.json](./package.json)

```sh
 make sure you have globally the required engines/versions installed.
```

## Getting installation started.

```sh
- Please install the following globally on your machine.
  - lerna ">= 3.20.2".
  - typescript ">= 4.1.4"
- then in the project root  run `yarn bootstrap` .
```

## yarn bootstrap

```sh
  It will install the required dependencies / bins for the project and builds the packages .
```

---

# Project overview

## See `development and tools` devpackages details.

<details>
  <summary>The `devpackages` contains development only packages/tools like clis eg.`domain-validate-packages-deps`.</summary>

1. What is the `(domain-validate-packages-deps)`

```sh
- the package will validate the packages and modules dependencies along with typescript
  references.
- you can also try `domain-validate-packages-deps --h` to see all options.
```

2. What is the `(domain-precommit-linter)`

```sh
- the package will prettify, linting and validate dependencies staged files only
 if you want to include also unstaged files run `yarn lint:modified`.
```

3. What is the `(domain-prepush-linter)`

```sh
- the package will prettify, linting, validate dependencies if current branch is
`master`.
```

4. What is the `(domain-validate-packages-assets)`

```sh
- the package will validate the packages and modules assets.
- you can also try `domain-validate-packages-assets --h` to see all options.
```

5. What is the `(domain-validate-app-assets)`

```sh
- the package will validate the current app assets from its routes data config up
  to their dependencies by checking `assetsPaths` in their package.json file.
- you can also try `domain-validate-app-assets --h` to see all options.
```

6. What is the `(domain-post-whatsapp-build-message)`

```sh
- the package will zip/uploads the build folder and upload it to 'https://file.io'
  then posts a message to whatsapp with build info and down file link.
```

7. What is the `(domain-serve-app)`

```sh
- the package locally serve a given `app` build static files.
- you can also try `domain-serve-app --h` to see all options.
```

</details>

---

## See `packages and modules` details.

<details>
  <summary>these folders only for developing code that runs in the browser</summary>

1.  What is the `packages` folder

```sh
Contains `sharable and reusable` packages across the project.
```

2. What is the `xxx-modules` folders

```sh
Contains pages/components are only rendered in current module.
```

</details>
