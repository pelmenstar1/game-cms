---
name: new-package
description: Create a new package in the game-cms monorepo with correct structure, config, and registration
argument-hint: <package-name> [--build | --no-build]
---

## Creating a new package in the monorepo

Parse `$ARGUMENTS` to extract:

- **package name** — the positional argument (required)
- **build flag** — `--build` or `--no-build` (optional)

If `--build` is passed, the package is built (added to `tsconfig.packages.json`).
If `--no-build` is passed, it is not built (skipped from `tsconfig.packages.json`).
If neither is specified, infer from the package name: packages that look like e2e runners, dev-only tools, or test harnesses (e.g. names containing `e2e`, `test`, `dev`, `scripts`) are non-built; everything else is built.

Create the package following these steps:

1. **Create the directory** `packages/<name>/` with:
   - `src/index.ts` — entry point
   - `package.json`
   - `tsconfig.json`

2. **package.json** template:

   ```json
   {
     "name": "@game-cms/<name>",
     "packageManager": "pnpm@10.28.1",
     "type": "module",
     "dependencies": {},
     "devDependencies": {
       "typescript": "catalog:"
     },
     "exports": {
       ".": {
         "import": "./dist/index.js",
         "types": "./dist/index.d.ts"
       }
     }
   }
   ```

   - Use `"catalog:"` for shared dependency versions
   - Use `"workspace:*"` for internal deps

3. **tsconfig.json** template:

   ```json
   {
     "extends": "../../configs/tsconfig.lib.json",
     "compilerOptions": {
       "rootDir": "./src",
       "outDir": "./dist"
     },
     "include": ["./src"],
     "references": []
   }
   ```

   - Add `references` entries for any internal packages this one depends on

4. **Register in root tsconfig files:**
   - **Always** add `{ "path": "./packages/<name>" }` to `tsconfig.ref.json` (used for IDE/type-checking across the whole repo)
   - **If the build flag resolved to "build"**, also add it to `tsconfig.packages.json` (used for building publishable packages)
   - If the build flag resolved to "no-build", only add to `tsconfig.ref.json`

5. Run `pnpm install` to link the new package
