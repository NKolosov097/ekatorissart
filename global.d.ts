// Ambient declaration so TypeScript accepts the side-effect import of
// globals.css from the App Router root layouts (ts(2882) under TS 5.7+).
// Next compiles CSS at build time; this only quiets the type checker.

declare module "*.css";
