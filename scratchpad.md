# ProjectTime (legacy EP307000 stopwatch) — Agent Scratchpad

> **Living document.** Every agent: read this top to bottom before working, claim your work in
> [Work claims](#work-claims), and update [Learnings](#learnings) / [Session log](#session-log) before you finish.
> The master plan for the replacement lives in `..\Acumatica-PK-TimeClock\scratchpad.md`.

Last updated: 2026-11-13, session 1 (repo restructure).
**State:** LEGACY, live on PK9 (and on the live site). Being retired by `Acumatica-PK-TimeClock` Phase 5. Only change
it to support that switchover.

## Read order for a new agent
1. This file. 2. `navigation.md`, then the `navigation.md` of the folder you touch.
3. `..\Acumatica-PK-TimeClock\docs\T290.md` before touching any `.ts` / `.html`.
4. `..\Acumatica-PK-TimeClock\docs\reference.md` §1 for how the legacy clock behaves.

## What this project is
Customization project **`ProjectTime`**: lets employees enter time activities as a stopwatch on *Employee Time Activities* (EP307000).
- Custom fields on `PMTimeActivity` (`UsrPGClockStatus` A/P/C, `UsrPGIsPaused`, `UsrPGEndDate`, `UsrPGProgressStartTime/EndTime/TimeSpent`) and on the filter (`UsrPGFromDate`, `UsrPGTillDate`).
- Graph extension on `EmployeeActivitiesEntry`: defaults + `Pause_Timer` / `Stop_Timer` actions.
- Modern UI extension of EP307000 (buttons, filter dates, clock columns).

## What is live on PK9 (verified 2026-11-13)
| Layer | Source here | Live copy | Status |
|---|---|---|---|
| Graph extension | `src/Code/EmployeeActivitiesEntry_Extension.cs` | `PK9\App_RuntimeCode\EmployeeActivitiesEntry.cs` | Identical (SHA-256 match) |
| DAC extensions | `src/DACs/*.cs` (snippets) | `App_RuntimeCode\PX_Objects_CR_PMTimeActivity_extensions.cs`, `..._CR_OwnedFilter_extensions.cs` | Same attributes (compared by eye) |
| Modern UI | `src/FrontendSources/screens/EP/EP307000/extensions/EP307000_PKTimeClock.{ts,html}` | `PK9\FrontendSources\screen\src\customizationScreens\Company\screens\EP\EP307000\extensions\` | Identical to the site files (copied 2026-11-13); `Test-ModernUI.ps1` = OK |
| Project owner of the Modern UI files | — | DB: `CustObject` of project `ProjectTime` (CompanyID 2), `PerTenantFile#screens\EP\EP307000\extensions\EP307000_PKTimeClock.*`, last modified 2026-08-24 | Not in `exports/project.xml` |

## Dependencies (must stay published together)
| Dependency | Why |
|---|---|
| `PKTimeClock` (`Acumatica-PK-TimeClock`) | Its engine `PKEmployeeActivitiesEntryExt` extends the same graph; this project's extension also runs inside it. Its Date `FieldDefaulting` throws an NRE if the row is null — PKTimeClock always passes a Date on insert. |
| `Contact`, `ProjectTask` | Existing projects on PK9, unrelated to this code |

## Open items
| # | Item | Owner |
|---|---|---|
| 1 | `exports/project.xml` / `ProjectTime.zip` predate Modern UI (product-version 21.211) and lack the `PerTenantFile` items. Decide: re-export from PK9, or leave as historical snapshot until the project is retired. | user |
| 2 | Retirement plan: remove `Stop_Timer` / `Pause_Timer`, buttons and clock columns from EP307000 once PKEP3001 is accepted live (PK-TimeClock Phase 5; keep fields read-only during the switchover). | agent / user |
| 3 | Legacy start-time field reads 1 h off (`UsrPGProgressStartTime`: `UseTimeZone`, no `PreserveTime`). See `..\Acumatica-PK-TimeClock\scratchpad.md` Open items. | agent |

## Coordination rules
1. Claim work below before editing; release when done. 2. Edit source only under `src/`.
3. Never publish customizations; never edit generated folders on PK9; never write to the DB without explicit user approval.
4. Record findings here, not just in chat. Same rules as `..\Acumatica-PK-TimeClock\scratchpad.md` → Coordination rules.

## Work claims
| Area | Claimed by | Since | Notes |
|---|---|---|---|
| *(none)* | | | |

## Learnings
- The Modern UI extension class/file names use the suffix `_PKTimeClock` but belong to the **ProjectTime** project, not `PKTimeClock`.
- Actions `Stop_Timer` / `Pause_Timer` are declared as `PXActionState` in the extension; names must match the graph actions (`stop_Timer` / `pause_Timer` in C#).
- `UsrPGProgress*_Time` columns use `timeMode: true` + `format: "t"`; the `_Date` halves are separate fields.
- Folder layout changed 2026-11-13 (old → new): `Business Logic/` → `src/Code/`, `DACs/` → `src/DACs/`,
  `Acumatica Base Code for reference/` → `reference/base-code/`, `Example Screenshots/` → `docs/screenshots/`,
  `customization_project_exports/` → `exports/`. `src/FrontendSources/`, `tools/` and all `navigation.md` / `CLAUDE.md` / `scratchpad.md` are new.

## Session log
| Date | Session | Summary |
|---|---|---|
| 2026-11-13 | 1 | Pulled the Modern UI work (EP307000 extension .ts/.html) from PK9 into `src/FrontendSources`; verified C# is unchanged vs `App_RuntimeCode`; restructured the repo on the PK-TimeClock model (src/, docs/, reference/, exports/, tools/); added CLAUDE.md, scratchpad.md and navigation.md files; copied `tools/Test-ModernUI.ps1`; updated README and the PK9 / PK-TimeClock pointers. Not committed. |
