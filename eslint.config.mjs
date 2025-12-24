import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    // We ignore the old codebase as it's not going to be fixed to comply with linter, but migrated to TS.
    { ignores: ["public/", "oldjs/", "dist/", "src/globals.d.ts"] },

    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.strict,
]);
