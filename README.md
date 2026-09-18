# Portal Foundation Dashboard

## Setup

### Prerequisites

- Node.js `v22.18.0` (recommended)
- npm `11.17.0` (recommended)

### Setup and running

Clone the repository and use the `main` branch:

```bash
git clone https://github.com/Solivar/portal-foundation-dashboard.git
cd portal-foundation-dashboard
git switch main
```

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

Vite prints the local application URL in the terminal, typically
`http://localhost:5173`.

To build and preview the production bundle locally:

```bash
npm run build
npm run preview
```

### Checks

Run the project checks with:

```bash
npm test
npm run lint
npm run typecheck
npm run format:check
```

If the formatting check reports issues, fix them with:

```bash
npm run format
```

## Design Tokens & Brand Adherence

The provided `atea-tokens-example-v2.json` is split into two SCSS files and
exposed as CSS custom properties:

- The JSON `primitives` object maps to `_primitives.scss`.
- The JSON `semantics` object maps to `_semantics.scss`.
- `_tokens.scss` is the shared token entrypoint loaded by
  `src/styles/global.scss`.

Numeric spacing, radius, focus, and typography values from the JSON were
converted to `rem` where appropriate so that text and interface elements scale
with the user's root font-size preference. Components consume semantic tokens
rather than depending directly on raw color values.

### Atea design guidelines

Elevation, grid, and iconography follow the
[Atea Design Foundations](https://design.atea.com/foundations/) documentation:

- **Elevation:** Five shadow levels. Cards use level 1; search and notification
  panels use level 4.
- **Grid:** A responsive 12-column grid with token-based gutters and 12, 6, and
  4-column spans. Items stack on small screens.
- **Iconography:** Reusable 24 × 24 inline SVGs inherit `currentColor`.
  Decorative icons are hidden from assistive technology.

### Accessibility

The interface supports keyboard and assistive-technology users:

- `Tab` and `Shift+Tab` navigate interactive elements in logical document
  order.
- Keyboard focus is indicated by a consistent `:focus-visible` outline using
  the provided design tokens.
- A skip link allows keyboard users to move directly to the main dashboard
  content.
- The `Escape` key closes the global search results and notification panel.
