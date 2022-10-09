import type { Options } from "tsup";

export const tsup: Options = {
  entry: ["packages/core/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  clean: true,
  shims: false,
};
