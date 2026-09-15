# Portal Foundation Dashboard

## Design Tokens & Brand Adherence

Design tokens from the provided JSON are carried into `src/styles` as CSS custom
properties. `src/main.tsx` imports `src/index.scss`, which loads the token
entrypoint with `@use './styles/tokens'`.

- The JSON `primitives` section maps to `_primitives.scss`.
- The JSON `semantics` section maps to `_semantics.scss`.
- `_tokens.scss` loads both files as the token entrypoint.

Spacing, radius, and typography tokens use `rem` to support resizable text and
UI elements.
