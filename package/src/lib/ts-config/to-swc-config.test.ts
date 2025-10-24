import { toSWCConfig } from './to-swc-config.js';
import test from 'ava';

test('Minimal configuration', t => {
    const swcConfig = toSWCConfig({});
    t.deepEqual(swcConfig, {
        jsc: {
            target: 'esnext',
            baseUrl: undefined,
            paths: undefined,
            preserveAllComments: true,
            transform: {
                decoratorMetadata: false,
                decoratorVersion: '2022-03',
                verbatimModuleSyntax: false,
                legacyDecorator: false
            },
            parser: { syntax: 'typescript', decorators: true },
            output: { charset: 'utf8' }
        },
        sourceMaps: false,
        exclude: undefined,
        module: {
            type: 'es6',
            strict: false,
            strictMode: false,
            resolveFully: true,
            allowTopLevelThis: true,
            exportInteropAnnotation: true,
            importInterop: 'node'
        }
    });
});

test('es2024 with experimental decorators', t => {
    const swcConfig = toSWCConfig({
        compilerOptions: {
            strict: true,
            target: 'es2024',
            module: 'node20',
            moduleResolution: 'node16',
            verbatimModuleSyntax: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,

            outDir: './dist',
            rootDir: './src',
            baseUrl: './src',
            paths: {
                '@lib/*': [ './lib/*' ]
            }
        },
        exclude: [
            './src/**/*.test.ts'
        ]
    });

    t.deepEqual(swcConfig, {
        jsc: {
            target: 'es2024',
            baseUrl: './src',
            paths: {
                '@lib/*': [ './lib/*' ]
            },
            preserveAllComments: true,
            transform: {
                decoratorMetadata: true,
                decoratorVersion: '2021-12',
                verbatimModuleSyntax: true,
                legacyDecorator: false
            },
            parser: { syntax: 'typescript', decorators: true },
            output: { charset: 'utf8' }
        },
        sourceMaps: false,
        exclude: [
            './src/**/*.test.ts'
        ],
        module: {
            type: 'es6',
            strict: true,
            strictMode: true,
            resolveFully: true,
            allowTopLevelThis: true,
            exportInteropAnnotation: true,
            importInterop: 'node'
        },
    });
});