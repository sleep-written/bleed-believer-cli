# bleed-believer cli
## Installation
Using npm:
```shell
npm i --save-dev @bleed-believer/cli
```

## Usage
To execute typescript files (for example `./src/index.ts`), simply use:
```shell
npx bleed start ./src/index.ts -- arg1 arg2 arg3
```

To transpile your project:
```shell
npx bleed build
```

...if you want to specify your custon tsconfig file:
```shell
# For execution
npx bleed start ./src/index.ts --config ./tsconfig.build.json -- arg1 arg2 arg3
npx bleed start ./src/index.ts -c ./tsconfig.build.json -- arg1 arg2 arg3

# For transpile
npx bleed build --config ./tsconfig.build.json
npx bleed build -c ./tsconfig.build.json
```