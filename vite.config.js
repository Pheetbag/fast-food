import { defineConfig } from "vite";

export default defineConfig({
    publicDir: "./public",
    esbuild: {
        // Specificy the same as in tsconfig.json target field. As vite ignore that one.
        target: "es2022",
    },
    build: {
        // Specificy the same as in tsconfig.json target field. As vite ignore that one.
        target: "es2022",
    },
});
