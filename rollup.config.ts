import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"
import minify from "rollup-plugin-babel-minify"
import camelCase from "lodash.camelcase"
import pkg from "./package.json" assert { type: "json" }
import type { RollupOptions } from "rollup"

const LIBRARY_NAME = "reactotron-realm"
const GLOBALS = {
  realm: "realm",
}

const config: RollupOptions = {
  input: "src/reactotron-realm.ts",
  output: [
    {
      file: pkg.main,
      name: camelCase(LIBRARY_NAME),
      format: "umd",
      sourcemap: true,
      globals: GLOBALS,
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
      globals: GLOBALS,
    },
  ],
  plugins: [
    resolve({ extensions: [".ts"] }),
    babel({ extensions: [".ts"], runtimeHelpers: true }),
    process.env.NODE_ENV === "production"
      ? minify({
          comments: false,
        })
      : null,
    filesize(),
  ],
  external: ["realm", "reactotron-core-client"],
}

export default config
