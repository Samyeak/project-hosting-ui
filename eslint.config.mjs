import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginNextOnPages from "eslint-plugin-next-on-pages";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Add next-on-pages plugin with recommended config
  {
    plugins: {
      "next-on-pages": pluginNextOnPages,
    },
    rules: {
      ...pluginNextOnPages.configs.recommended.rules,
    },
  },
];

export default eslintConfig;
