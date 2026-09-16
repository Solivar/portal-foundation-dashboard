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

The layout grid from the design system is represented by the reusable `Grid`
component in `src/components/ui/Grid`. It uses a 12-column foundation with the
shared spacing tokens for column gaps and supports the documented `Col-12`,
`Col-6`, and `Col-4` patterns through constrained `span` values. Grid items
stack full-width on small screens and apply their documented column spans from
the shared `md` breakpoint upward.
