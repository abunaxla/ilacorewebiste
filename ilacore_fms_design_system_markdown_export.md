# Ilacore FMS Telemetry Console Design System Specification

> **Official Brand & Telemetry System Document**
> Target Frameworks: React, Next.js, Vue, Tailwind CSS, Claude Code, Design Tokens CLI

---

## 1. Brand Identity & Color Tokens

### Official Brand Anchors
- **Primary Navy**: `#010875` (`bg-[#010875]`, `text-[#010875]`) — Core corporate color, used for primary button fills, key chrome accents, and light-theme sidebar navigation.
- **Secondary Warm Gold**: `#DCA238` (`bg-[#dca238]`, `text-[#dca238]`) — Secondary accent, brand icon circuits, signature 'o' accent, and Diesel (AGO) telemetry indicator.

### Telemetry Command Console (Dark Mode Surfaces)
| Token | Hex | Tailwind Utility | Semantic Application |
| :--- | :--- | :--- | :--- |
| `surface-canvas` | `#050B14` | `bg-[#050b14]` | Global viewport background |
| `surface-sidebar` | `#08101D` | `bg-[#08101d]` | Persistent forecourt sidebar chrome |
| `surface-card` | `#0E1A2C` | `bg-[#0e1a2c]` | Telemetry cards, KPI modules, tables |
| `surface-card-hover` | `#13233B` | `bg-[#13233b]` | Hover state for interactive rows/cards |
| `surface-card-active`| `#1B2F4E` | `bg-[#1b2f4e]` | Active navigation pills, selected items |

### Divider & Border Tokens
| Token | Hex | Tailwind Utility | Semantic Application |
| :--- | :--- | :--- | :--- |
| `border-subtle` | `#18273E` | `border-[#18273e]` | Module borders, panel dividers |
| `border-muted` | `#223859` | `border-[#223859]` | Input borders, nested tables |
| `border-brand-gold` | `#DCA238` | `border-[#dca238]` | Highlight borders, active badges |
| `border-brand-navy` | `#010875` | `border-[#010875]` | Corporate boundaries |
| `border-focus` | `#38BDF8` | `border-sky-400` | Input focus rings, tab underline |

### Telemetry Status Colors
- **Live Online**: `#10B981` (`text-emerald-400`, `bg-emerald-500/20`) — Gateway & dispenser connectivity.
- **Fuel PMS (Petrol)**: `#F43F5E` (`bg-[#f43f5e]`) — Tank level gauge & fuel grade badge.
- **Fuel AGO (Diesel)**: `#DCA238` (`bg-[#dca238]`) — Tank level gauge & brand warm gold alignment.
- **Active Open Alert**: `#FFFFFF` on `#1E293B` (`bg-slate-800 text-white`) — `▲ Open` alert pill.

---

## 2. Typography System

- **UI Sans-Serif**: `'Space Grotesk'`, `'Nunito Sans'`, system-ui, sans-serif
- **Tabular Monospace**: `'JetBrains Mono'`, `'SF Mono'`, monospace (for tank litres, serials, telemetry timestamps)

| Level | Size | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **H1** | 24px (`1.5rem`) | 700 | `-0.02em` | Page header / Station title |
| **H2** | 16.8px (`1.05rem`) | 600 | `-0.01em` | Telemetry card titles |
| **Body** | 14px (`0.875rem`) | 400 | `0` | Standard copy, table rows |
| **Caption Mono** | 12px (`0.75rem`) | 500 / 700 | `+0.05em` | Volume figures, dates, MACs |

---

## 3. Brand Assets (SVG References)

### Dark Mode Logo (White Lettering + Gold Accent)
Use DataStore asset `{{DATA:IMAGE:IMAGE_8}}` or inline SVG:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 160">
  <!-- Circuit Eye in #DCA238 & #010875, Letters in #FFFFFF, 'o' in #DCA238 -->
</svg>
```

### Light Mode / Full Color Logo (Navy Lettering + Gold Accent)
Use DataStore asset `{{DATA:IMAGE:IMAGE_7}}` or inline SVG:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 160">
  <!-- Circuit Eye in #DCA238 & #010875, Letters in #010875, 'o' in #DCA238 -->
</svg>
```

---

## 4. Production Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ilacore: {
          navy: '#010875',
          gold: '#DCA238',
          canvas: '#050B14',
          sidebar: '#08101D',
          card: '#0E1A2C',
          hover: '#13233B',
          active: '#1B2F4E',
          border: '#18273E',
          divider: '#223859',
          pms: '#F43F5E',
          ago: '#DCA238',
          online: '#10B981',
          sky: '#38BDF8',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Nunito Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      }
    }
  }
}
```

---

## 5. Standard Component Code Snippets

### A. Telemetry Metric Card
```html
<div class="bg-[#0E1A2C] border border-[#18273E] rounded-xl p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-slate-100 font-semibold text-base">Card Title</h3>
    <span class="text-xs font-mono text-[#DCA238]">Telemetry Active</span>
  </div>
  <div class="flex-1">
    <!-- Metric visualization -->
  </div>
  <div class="mt-4 pt-3 border-t border-[#18273E]/60 flex justify-end">
    <a href="#" class="text-xs text-sky-400 hover:text-[#DCA238] font-medium inline-flex items-center gap-1 transition-colors">
      View report &gt;
    </a>
  </div>
</div>
```

### B. Ullage Tank Gauge (AGO Diesel)
```html
<div class="flex flex-col items-center w-full max-w-[150px]">
  <div class="w-full h-44 rounded-2xl bg-[#050B14] border border-[#18273E] p-1 flex flex-col justify-end relative overflow-hidden">
    <div class="absolute top-3 inset-x-0 text-center z-10">
      <div class="text-lg font-bold font-mono text-white">66.1%</div>
      <div class="text-[10px] uppercase font-mono tracking-wider text-slate-400">FULL</div>
    </div>
    <div class="w-full rounded-b-xl bg-[#DCA238] transition-all" style="height: 66.1%;">
      <div class="m-2 p-1.5 rounded-lg bg-[#010875]/80 backdrop-blur-sm text-center border border-[#DCA238]/30">
        <div class="text-xs font-bold text-white tracking-wide">T2</div>
        <div class="text-[9px] uppercase tracking-wider text-[#DCA238]">DIESEL (AGO)</div>
      </div>
    </div>
  </div>
  <div class="mt-3 text-center">
    <div class="text-xs font-mono font-bold text-slate-200">24,418.83 L <span class="font-normal text-slate-400">of 36,945 L</span></div>
    <div class="text-[11px] font-mono text-slate-500">Room for 12,526.17 L</div>
  </div>
</div>
```
