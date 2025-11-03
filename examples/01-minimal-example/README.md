# Minimal example
-   Install dependencies:
    ```shell
    npm ci
    ```

-   Execute source code:
    ```shell
    npx bleed start ./index.mts
    ```

-   Execute source code passing arguments:
    ```shell
    npx bleed start ./index.mts -- hello world --foo bar
    ```

-   Execute source code in watch mode:
    ```shell
    npx bleed watch ./index.mts
    ```

-   Transpile files:
    ```shell
    npx bleed build
    ```