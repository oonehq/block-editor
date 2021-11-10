import path from "path"
import typescript from "@rollup/plugin-typescript"
import postcss from "rollup-plugin-postcss"
import alias from "@rollup/plugin-alias"
import execute from "rollup-plugin-execute"
import nodeResolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

const plugins = [
  typescript(),
  postcss({
    config: {
      path: "./postcss.config.js",
    },
    extensions: [".css"],
    minimize: true,
    extract: "style.css",
  }),
  nodeResolve(),
  commonjs(),
  execute("yalc push --replace"),
]

export default {
  input: "src/index.tsx",
  output: [
    {
      file: `dist/index.umd.js`,
      name: "BlockEditor",
      format: "umd",
      sourcemap: true,
      globals: {
        react: "React",
      },
    },
    {
      file: `dist/index.es.js`,
      format: "es",
      sourcemap: true,
    },
  ],
  external: [
    "react",
    "react-dom",
    "react-admin",
    "html-to-image",
    "react-final-form",
    "react-beautiful-dnd",
  ],
  plugins,
}
