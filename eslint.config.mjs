import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".vercel/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "next-env.d.ts",
      "tsconfig.tsbuildinfo"
    ]
  },
  ...nextVitals
];

export default eslintConfig;
