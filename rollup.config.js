import fs from "fs";
import path from "path";

import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";
import svgr from "@svgr/rollup";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const inputs = fs
  .readdirSync("./src", { withFileTypes: true })
  .reduce((config, f) => {
    if (f.isDirectory() && f.name !== "stories") {
      const name = f.name;
      const dir = `src/${name}`;

      const files = fs.readdirSync(dir).reduce((result, file) => {
        if (file.match(/spec|test|stories/i)) {
          return result;
        }

        const filename = path.parse(file).name;
        result[`${name}/${filename}`] = `${dir}/${file}`;

        return result;
      }, {});

      return { ...config, ...files };
    }

    return config;
  }, {});

const input = { ...inputs, index: "./src/index.ts" };

export default [
  {
    input,
    output: [
      {
        dir: "dist/cjs",
        format: "cjs",
        exports: "named",
      },
    ],
    external: [/@babel\/runtime/],
    plugins: [
      peerDepsExternal(),
      babel({
        extensions,
        babelHelpers: "runtime",
        skipPreflightCheck: true,
        exclude: /node_modules/,
      }),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist/cjs",
        sourceMap: false,
      }),
      url(),
      svgr(),
    ],
  },
  {
    input,
    output: [
      {
        dir: "dist/esm",
        format: "esm",
        exports: "named",
      },
    ],
    external: [/@babel\/runtime/],
    plugins: [
      peerDepsExternal(),
      babel({
        extensions,
        babelHelpers: "runtime",
        skipPreflightCheck: true,
        exclude: /node_modules/,
      }),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationDir: null,
        sourceMap: false,
      }),
      url(),
      svgr(),
    ],
  },
];
