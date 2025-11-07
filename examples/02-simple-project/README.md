# Simple project
-   Install dependencies:
    ```shell
    npm ci
    ```

-   Execute source code:
    ```shell
    npx bleed start ./src/index.mts
    ```

-   Execute source code in watch mode:
    ```shell
    npx bleed start ./src/index.mts --watch
    ```

-   Execute source code passing arguments:
    ```shell
    npx bleed start ./src/index.mts -- hello world --foo bar
    ```

-   Transpile files:
    ```shell
    npx bleed build --config ./tsconfig.build.json
    ```