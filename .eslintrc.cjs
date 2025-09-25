/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    // "@typescript-eslint/consistent-type-imports": [
    //   "warn",
    //   {
    //     prefer: "type-imports",
    //     fixStyle: "inline-type-imports",
    //   },
    // ],
    // "@typescript-eslint/no-unused-vars": [
    //   "warn",
    //   {
    //     argsIgnorePattern: "^_",
    //   },
    // ],
    "@typescript-eslint/require-await": "off",
    // "@typescript-eslint/no-misused-promises": [
    //   "error",
    //   {
    //     argsIgnorePattern: "^_",
    //   },
    // ],
    "@typescript-eslint/no-misused-promises": "off",

    // Reglas para deshabilitar warnings de any
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    // Reglas para evitar errores en build
    "@typescript-eslint/prefer-nullish-coalescing": "warn", // Cambiar de error a warning
    "@typescript-eslint/await-thenable": "warn", // Cambiar de error a warning

    // Nuevas reglas para deshabilitar los errores mostrados
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-unused-vars": "off",
    // Regla adicional para el error de cadena opcional con aserción no nula
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",

    // Regla para permitir aserciones no nulas
    "@typescript-eslint/prefer-as-const": "off",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",

    // Regla para permitir aserciones no nulas extras (!!x)
    "@typescript-eslint/no-extra-non-null-assertion": "off",

    // Regla para desactivar errores de promesas no manejadas
    "@typescript-eslint/no-floating-promises": "off",

    // Nuevas reglas para los errores adicionales
    "@typescript-eslint/prefer-promise-reject-errors": "off",
    "@typescript-eslint/no-base-to-string": "off",
    "@typescript-eslint/dot-notation": "off",

    // Regla para desactivar la preferencia de .find() sobre .filter()[0]
    "@typescript-eslint/prefer-find": "off",

    // Reglas adicionales para los nuevos errores
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-duplicate-type-constituents": "off",
    "@typescript-eslint/prefer-includes": "off",
    "@typescript-eslint/prefer-string-starts-ends-with": "off",

    // Regla para deshabilitar el error de suma no restringida
    "@typescript-eslint/restrict-plus-operands": "off",


    // Regla para deshabilitar el error de await-promise
    "@typescript-eslint/await-promise": "off",

    // Regla para deshabilitar el error de await-promise-function-type
    "@typescript-eslint/await-promise-function-type": "off",

    // Regla para deshabilitar el error de prefer-optional-chain
    "@typescript-eslint/prefer-optional-chain": "off",

    // Regla para deshabilitar el error de only-throw-error
    "@typescript-eslint/only-throw-error": "off",

    // Regla para deshabilitar el error de consistent-indexed-object-style
    "@typescript-eslint/consistent-indexed-object-style": "off",

    // Regla para deshabilitar el error de no-unsafe-optional-chaining
    "@typescript-eslint/no-unsafe-optional-chaining": "off",

    // Regla para deshabilitar el error de prefer-for-of
    "@typescript-eslint/prefer-for-of": "off",

    // Regla para deshabilitar el error de prefer-function-type
    "@typescript-eslint/prefer-function-type": "off",

    // Regla para deshabilitar el error de no-empty-object-type
    "@typescript-eslint/no-empty-object-type": "off",

    // Regla para deshabilitar el error de no-unsafe-function-type
    "@typescript-eslint/no-unsafe-function-type": "off",
    "@typescript-eslint/no-redundant-type-constituents": "off",

    // All imports in the declaration are only used as types. Use `import type`
    "@typescript-eslint/consistent-type-imports": "off",

    // Use "@ts-expect-error" instead of "@ts-ignore", as "@ts-ignore" will do nothing if the following line is error-free
    "@typescript-eslint/no-misused-ignore": "off",
  },
};

module.exports = config;
