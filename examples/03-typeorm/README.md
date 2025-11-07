# TypeORM
-   Install dependencies:
    ```shell
    npm ci
    ```

-   Execute source code:
    ```shell
    npx bleed start ./src/index.ts
    ```

-   Execute source code in watch mode:
    ```shell
    npx bleed start ./src/index.ts --watch
    ```

-   Execute source code passing arguments:
    ```shell
    npx bleed start ./src/index.ts -- hello world --foo bar
    ```

-   Transpile files:
    ```shell
    npx bleed build --config ./tsconfig.build.json
    ```