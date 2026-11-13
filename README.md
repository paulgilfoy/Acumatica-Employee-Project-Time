# Acumatica-Employee-Project-Time

> **Retiring (2026-11-13).** The EP307000 clock code moved to [`Acumatica-PK-TimeClock`](../Acumatica-PK-TimeClock) (decision D16);
> EP307000 stays in use. This project (`ProjectTime`) is unpublished at the next PKTimeClock publish.
> Agents: start with `CLAUDE.md` → `scratchpad.md` → `navigation.md`.

Acumatica customization (`ProjectTime`) that lets employees enter time activities as a stopwatch from the
"Employee Time Activities" (EP307000) screen. Targets Acumatica 2026 R2 (26.200) **Modern UI** on PK9.

## Layout
| Folder | Contents |
|---|---|
| `src/Code/` | Graph extension `EmployeeActivitiesEntry_Extension.cs`. The Time-Clock feature is lines 118–277: 118–165 set default values for 3 fields; the two actions `stop_Timer()` and `pause_Timer()` are lines 170–277. |
| `src/DACs/` | Attribute snippets for the custom database fields. The core of the Time-Clock is in `PMTimeActivity` and `EPActivityApprove` (base DAC is `PMTimeActivity`; mirror any `EPActivityApprove` change there). `PMTimeActivityFilter` customizes the screen filter. |
| `src/FrontendSources/screens/EP/EP307000/extensions/` | **Modern UI** extension of EP307000: Pause/Stop buttons, From/Until filter dates, clock columns in the Activity grid. |
| `docs/screenshots/` | Example screenshots of the legacy screen |
| `reference/base-code/` | Acumatica base source for reference (older version) |
| `exports/` | Exported customization package from the original Classic-era project |
| `tools/` | `Test-ModernUI.ps1` — type-check the Modern UI TypeScript |

## Publishing
Add `EP307000` to the project's **Customized Screens** and include the Modern UI files
(`screens\EP\EP307000\extensions\EP307000_PKTimeClock.ts` / `.html`) as per-tenant files. The added DAC fields appear in the
Filter form and Activity grid via the Modern UI extension; no extra layout work is needed. The files in `exports/` predate Modern UI
and do **not** include them — see `exports/navigation.md`.
