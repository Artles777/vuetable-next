import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";


export default [
  {files: ["**/*.{js,mjs,cjs,ts,vue}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {files: ["**/*.vue"], languageOptions: {parserOptions: {parser: tseslint.parser}}},
  {
    files: ["**/*.ts", "**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
      "no-console": ["warn", { allow: ["error", "debug"] }],
      "vue/attribute-hyphenation": ["error", "always"],
      "vue/valid-define-options": "error",
      quotes: "off",
      "@typescript-eslint/quotes": ["error", "double", { avoidEscape: true }],
      semi: "off",
      "@typescript-eslint/semi": "error",
      "no-self-compare": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-unreachable-loop": "error",
      "@typescript-eslint/no-var-requires": "error",
      "space-before-function-paren": ["warn", "always"],
      "key-spacing": "off",
      "@typescript-eslint/key-spacing": ["error", { beforeColon: false }],
      "keyword-spacing": "off",
      "@typescript-eslint/keyword-spacing": "warn",
      "@typescript-eslint/type-annotation-spacing": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": ["off"],
      "lines-between-class-members": ["error", "always"],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "enumMember",
          format: ["UPPER_CASE"]
        },
        {
          selector: "enum",
          format: ["PascalCase"],
          suffix: ["Enum"]
        }
      ],
      "@typescript-eslint/no-duplicate-enum-values": "error",
      "vue/block-lang": [
        "warn",
        {
          script: {
            lang: "ts"
          }
        }
      ],
      "vue/v-bind-style": ["error", "shorthand"],
      "vue/v-on-style": ["error", "shorthand"],
      "require-await": "error",
      "semi-spacing": [
        "error",
        {
          before: false,
          after: true
        }
      ],
      "vue/prefer-true-attribute-shorthand": ["error", "always"],
      "vue/html-closing-bracket-newline": ["error", {
        "singleline": "never",
        "multiline": "never"
      }],
      "vue/html-self-closing": ["error", {
        "html": {
          "void": "always",
          "normal": "never",
          "component": "never"
        },
        "svg": "always",
        "math": "always"
      }],
      "vue/singleline-html-element-content-newline": ["error", {
        "ignoreWhenNoAttributes": false,
        "ignoreWhenEmpty": false,
        "ignores": ["pre", "textarea"]
      }],
      "vue/html-indent": ["error", 2, {
        "attribute": 1,
        "baseIndent": 1,
        "closeBracket": 0,
        "alignAttributesVertically": true,
        "ignores": []
      }],
      "vue/multiline-html-element-content-newline": ["error", {
        "ignoreWhenEmpty": false,
        "allowEmptyLines": true
      }],
      "vue/attributes-order": ["error", {
        "order": [
          "DEFINITION",
          "CONDITIONALS",
          ["UNIQUE", "SLOT"],
          "TWO_WAY_BINDING",
          ["OTHER_DIRECTIVES", "RENDER_MODIFIERS"],
          "GLOBAL",
          "LIST_RENDERING",
          "ATTR_SHORTHAND_BOOL",
          "ATTR_DYNAMIC",
          "ATTR_STATIC",
          "CONTENT",
          "EVENTS",
        ]
      }],
      "vue/require-explicit-emits": "error",
      "indent": "off",
      "@typescript-eslint/indent": ["error", 2],
      "object-curly-spacing": ["error", "always"],
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn"
    }
  }
];