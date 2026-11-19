---
name: Ilacore FMS Telemetry Console
colors:
  surface: '#f9f9ff'
  surface-dim: '#d2daed'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#e1e8fb'
  surface-container-highest: '#dbe2f5'
  on-surface: '#141c29'
  on-surface-variant: '#454652'
  inverse-surface: '#29313f'
  inverse-on-surface: '#ecf0ff'
  outline: '#767683'
  outline-variant: '#c6c5d4'
  surface-tint: '#4c55b4'
  primary: '#000133'
  on-primary: '#ffffff'
  primary-container: '#010875'
  on-primary-container: '#767fe1'
  inverse-primary: '#bec2ff'
  secondary: '#7e5700'
  on-secondary: '#ffffff'
  secondary-container: '#fcbf52'
  on-secondary-container: '#714d00'
  tertiary: '#000b06'
  on-tertiary: '#ffffff'
  tertiary-container: '#00261b'
  on-tertiary-container: '#009a75'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bec2ff'
  on-primary-fixed: '#000569'
  on-primary-fixed-variant: '#333c9a'
  secondary-fixed: '#ffdeac'
  secondary-fixed-dim: '#f9bc50'
  on-secondary-fixed: '#281900'
  on-secondary-fixed-variant: '#604100'
  tertiary-fixed: '#5efcc9'
  tertiary-fixed-dim: '#38dfae'
  on-tertiary-fixed: '#002116'
  on-tertiary-fixed-variant: '#00513c'
  background: '#f9f9ff'
  on-background: '#141c29'
  surface-variant: '#dbe2f5'
typography:
  headline-xl:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  telemetry-metric-lg:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
  telemetry-metric-md:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: Nunito Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-mobile: 0.5rem
  margin: 1.5rem
  margin-mobile: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style
The brand targets industrial fleet managers, telemetry engineers, and operational command personnel who monitor high-throughput physical equipment in real time. The emotional register is authoritative, precise, hyper-vigilant, and fail-safe. 

The aesthetic is an advanced **Command Console & Industrial Telemetry Engine**. It fuses tactical control-room ergonomics with modern high-contrast information density. Rather than generic soft SaaS interfaces, the UI evokes high-stakes avionics and mission-critical telemetry terminals: structural grid discipline, illuminated data nodes, high contrast readouts against clean, accessible backdrops, and instant state recognition. Visual density is kept tight and actionable, eliminating ornamental fluff in favor of structured data ribbons, status meters, and mechanical clarity.

## Colors
The palette is calibrated strictly for clarity and high-contrast legibility in bright operational environments while retaining critical visual signals:

- **Primary (`#010875`)**: Deep Navy. Serves as the structural anchor, foundational surfaces, active frame accents, and focused state backdrops. For interactive highlights, an elevated tint operates as the active illumination tier.
- **Secondary / Accent (`#dca238`)**: Warm Gold / Amber. Reserved for primary operational confirmations, priority metrics, active warnings, operational cautions, and vital trajectory indicators.
- **Tertiary (`#1cd1a1`)**: Telemetry Emerald. Applied strictly to live data pings, nominal health telemetry, connected fleet signals, and online status monitors.
- **Surfaces**:
  - `Base Canvas`: `#f8fafc` (root application background).
  - `Console Layer 1`: `#ffffff` (primary workspace panels, tables, card backgrounds).
  - `Console Layer 2`: `#f1f5f9` (elevated drawers, metric wells, inputs, and flyouts).
  - `Console Layer 3`: `#e2e8f0` (hover states, modal overlays, interactive nodes).
- **Functional Telemetry Signals**:
  - `Critical Breach / Alarm`: `#ef4444` (bright emergency red).
  - `Advisory Warning`: `#dca238` (warm gold).
  - `Nominal`: `#10b981` (emerald green).
  - `Offline / Unresponsive`: `#64748b` (slate muted).
- **Text & Foreground**:
  - `Text Primary`: `#0f172a` (high legibility crisp dark ink).
  - `Text Secondary`: `#475569` (metadata, labels, auxiliary information).
  - `Text Muted`: `#94a3b8` (timestamps, grid indices, disabled controls).
  - `Border / Hairlines`: `#cbd5e1` with active telemetry borders scaling to `rgba(220, 162, 56, 0.6)` or `rgba(28, 209, 161, 0.6)`.

## Typography
The system employs a tri-type engine engineered for dense telemetry interfaces:

- **Nunito Sans** commands display headings, system monitors, vessel identifiers, and sectional caps. It injects a clean, modern aesthetic into the console framing.
- **Inter** ensures uninterrupted human readability for tabular lists, system logs, operational documentation, and data descriptions.
- **JetBrains Mono** is dedicated to critical numbers, sensor readings, coordinates, raw hexadecimal logs, system status counters, and operational parameters. All numeric metrics must render with tabular figures (`font-variant-numeric: tabular-nums`) to prevent optical shifting during live data streams.

All `label-caps` and technical subheaders must be styled with uppercase tracking (`letter-spacing: 0.08em` to `0.12em`) to mimic instrumentation control markings.

## Layout & Spacing
The layout follows an industrial **Fluid Grid with Multi-Pane Cockpit Docking**. Rather than generous open-air consumer spacing, density is calibrated for maximum glanceable intelligence per screen square inch.

- **Breakpoints**:
  - `Desktop High-Density / Multi-Screen`: `1440px+` (12 or 16-column layout, persistent navigation, real-time event ticker, floating tactical map).
  - `Tablet / Field Terminal`: `768px - 1439px` (8-column, collapsible telemetry drawer, priority cards).
  - `Mobile / Handheld Scanner`: `<768px` (4-column vertical stack, metric ribbons switch to horizontal snap scrolls).
- **Rhythm**: Spacing operates on a strict base-4 architecture. Internal panel paddings prefer `space-md` (12px) and `space-lg` (16px) to maximize real-estate efficiency for dense grids, real-time graphs, and data streams. Structural modules use explicit separation with 1px border frames rather than extensive margin gaps.

## Elevation & Depth
Elevation in the console does not rely on soft diffused consumer shadows. Instead, it relies on **Tonal Layering combined with Low-Contrast Hairline Borders and Clean Edge Definition**:

- **Layer 0 (Canvas Base - `#f8fafc`)**: Viewport canvas, background terrain maps, matrix backdrops.
- **Layer 1 (Recessed Well - `#f1f5f9`)**: Sensor history charts, telemetry terminal wells, embedded code blocks with a recessed inset border (`border: 1px solid rgba(0, 0, 0, 0.06)`).
- **Layer 2 (Operational Surface - `#ffffff`)**: Main instrument panels, data grids, parameter tables. Edges are framed with a precise border: `1px solid #cbd5e1`.
- **Layer 3 (Elevated HUD / Drawer - `#f1f5f9`)**: Modal controllers, flyout telemetry diagnostics, sliding side-drawers. Edges feature a crisp 1px dual border and an ambient clean drop shadow: `0 8px 24px rgba(1, 8, 117, 0.15)`.
- **Active / Alert Glows**: Elements in focused, active, or alarm states project a tight 2px outer optical glow (`box-shadow: 0 0 10px rgba(220, 162, 56, 0.25)` for Warm Gold warnings; `0 0 10px rgba(28, 209, 161, 0.25)` for live Nominal channels).

## Shapes
The console adopts a **Soft Industrial Geometry (Level 1)**. Roundedness is kept strictly controlled:
- Base inputs, buttons, chips, and metric cells feature an exact `0.25rem` (4px) corner radius.
- Cards, command panels, and modal containers use `0.375rem` (6px) or `0.5rem` (8px).
- Circles and pills are reserved solely for live status beacons and miniature state pings.

This sharp, slightly rounded approach evokes precision CNC-milled chassis frames, aerospace display equipment, and high-reliability ruggedized tablets. Rounded pills and bulbous bubbly corners are strictly prohibited across all functional components.

## Components

### Buttons & Interactive Triggers
- **Primary / Command Action**: Background `#010875`, text `#ffffff`, `font-family: Nunito Sans`, `font-weight: 700`, uppercase, `0.25rem` radius. Hover shifts to `#1628c7` with a subtle rim glow.
- **Operational / Secondary Action**: Background `#f1f5f9`, border `1px solid #010875`, text `#0f172a`. Hover shifts background to `#e2e8f0`.
- **Tactical / Danger Action**: Background `rgba(239, 68, 68, 0.1)`, border `1px solid #ef4444`, text `#ef4444`. Hover yields a solid red fill with pure white typography.
- **Dimensions**: Compact heights (32px for micro-actions, 40px for primary command triggers).

### Telemetry Cards & Metric Panels
- Constructed on `#ffffff` with `1px solid #cbd5e1`.
- Top header includes an uppercase `label-caps` label, accompanied by an instantaneous live state indicator (pulsing emerald dot for nominal, solid amber for threshold warning).
- Primary readout uses `JetBrains Mono` at `telemetry-metric-lg` with unit annotations aligned to the baseline in secondary text.

### Chips & Status Badges
- Strict rectangular tags with `0.25rem` corners.
- Background uses 10% opacity tints of the status color with a 1px border matching the tint:
  - *ONLINE*: `rgba(28, 209, 161, 0.15)`, border `#1cd1a1`, text `#0f766e`.
  - *CAUTION*: `rgba(220, 162, 56, 0.15)`, border `#dca238`, text `#92400e`.
  - *CRITICAL*: `rgba(239, 68, 68, 0.15)`, border `#ef4444`, text `#b91c1c`.
- Typography is strictly `label-code` in monospace uppercase.

### Data Tables & Telemetry Lists
- Zero zebra stripes; structure is demarcated by horizontal hairline borders (`1px solid #e2e8f0`).
- Row hover triggers an immediate shift to `#f1f5f9` with an active 2px left border accent in Warm Gold (`#dca238`).
- Header cells: `Nunito Sans` uppercase, `11px`, letter-spaced, text `#475569`, sticky positioned.

### Form Inputs & Terminal Selectors
- Background `#ffffff`, border `1px solid #cbd5e1`, text `#0f172a`, font `Inter`.
- Focus state: border shifts to `#010875` with an inner border highlight, nullifying native OS focus rings.
- Value inputs with unit measurements (e.g., PSI, RPM, °C, Knots) show units locked on the right in `JetBrains Mono` muted gray.

### Checkboxes & Segmented Toggles
- Custom square controls with `2px` radius. Checked state fills with `#010875` featuring a white tactical checkmark.
- Segmented switches use recessed light tracks (`#f1f5f9`) with elevated rectangular slugs (`#ffffff`) outlined in `#cbd5e1`.