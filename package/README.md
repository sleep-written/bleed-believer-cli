# bleed-believer cli
A `ts-node` replacement with path alias resolution and SWC under the hood.

## Basic usage
-   Install the package:
    ```shell
    npm i --save-dev @bleed-believer/cli
    ```

-   Next, launch your application (having a `tsconfig.json` is optional):
    ```shell
    ## Using the shortest executable name:
    npx bleed start ./src/index.ts

    ## ...or if you want the full executable name:
    npx @bleed-believer/cli start ./src/index.ts
    ```

If you don't have a `tsconfig.json` file in cwd, the `@bleed-believer/cli` will run your application using this default configuration:
```json
{
    "exclude": [ "node_modules" ],
    "compilerOptions": {
        "target": "esnext",
        "module": "nodenext",
        "moduleResolution": "nodenext"
    }
}
```

## CLI Commands
-   `npx bleed start <target>`  
    Run a TypeScript file using the custom ESM loader.

-   `npx bleed watch <target>`  
    Same as `start`, but watches file changes.

-   `npx bleed build [--config path/to/tsconfig.json]`  
    Transpile all files to JavaScript (like `tsc`, but faster).

## Flags

-   Use `--` to pass arguments to your script:
    ```bash
    bleed start ./src/index.ts -- --env=dev --debug

-   Use `--config` or `-c` to set custom tsconfig:
    ```shell
    bleed build --config tsconfig.prod.json
    ```