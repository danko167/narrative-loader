# Changelog

## Stage 0 (Baseline)

Initial project baseline captured from the current code state.

### Added
- `NarrativeLoader` component for narrative loading states in React.
- `useNarrativeLoader` hook for headless usage.
- Built-in presets by `variant` and `tone`, plus exported preset constants.
- Custom message support (`string` and rich message objects).
- Timeline support with both `message` and shorthand inline item shapes.
- Text animations (`fade`, `typewriter`, `dots`, `none`) and emoji animations.
- Polling support with `source`, `pollInterval`, `getMessage`, `stopWhen`, `fetcher`, and `sourceRequestInit`.
- Visibility controls: `delay`, `minVisibleDuration`, `doneMessage`, and `doneDuration`.
- Error handling with configurable `errorMessage` styling and runtime error text.
- Reduced-motion support for both CSS and JS-driven text animations.
- Accessibility status semantics (`role=status`, polite live region, atomic updates, busy state).
- Sequential polling with bounded retry/backoff behavior for transient failures.
- Test coverage for component and hook behavior, including polling, accessibility, and edge cases.
