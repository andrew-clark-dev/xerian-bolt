import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: [".amplfy/**"],
  },
  {
    rules: {
      "react/react-in-jsx-scope": "off"
    }
  },
  { languageOptions: { globals: globals.browser } },
];

