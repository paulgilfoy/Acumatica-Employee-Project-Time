# Repo navigation — Acumatica-Employee-Project-Time

Customization project **`ProjectTime`** (legacy stopwatch on *Employee Time Activities*, EP307000). Start with
**`scratchpad.md`** (status, rules, work claims); this file is just the map.

| Path | What's there | Agent actions |
|---|---|---|
| `scratchpad.md` | Living status, what is live on PK9, dependencies, coordination rules, **work claims**, session log | Read first. Claim work. Update before finishing. |
| `README.md` | Human overview of the customization | Keep in sync with `src/` |
| `src/` | **All customization source** of the `ProjectTime` project | Edit here only. → `src/navigation.md` |
| `docs/` | Reference: screenshots of the legacy UI | → `docs/navigation.md` |
| `reference/` | Acumatica base-code snapshots (older version) for reading | Read-only. → `reference/navigation.md` |
| `exports/` | Exported customization package (`project.xml`, `ProjectTime.zip`) from the original Classic-era project | Read-only snapshot. → `exports/navigation.md` |
| `tools/` | Agent tooling (Modern UI type-check) | Run. → `tools/navigation.md` |

## Related locations (outside this repo)
| Location | Purpose |
|---|---|
| `C:\Program Files\Acumatica ERP\PK9\navigation.md` | Map of the running Acumatica site (generated code, Modern UI sources, base screens) |
| `..\Acumatica-PK-TimeClock\` | **Successor**: new time clock screen PKEP3001 + Preparer Dashboard. Its engine (`PKEmployeeActivitiesEntryExt`) runs on the same graph as this project's extension. Its `scratchpad.md` is the master plan. |
| `..\Acumatica-Project-Task-PK\` | `ProjectTask` customization (`UsrPG*` fields on PMTask/Contract). Do not edit from here. |
| `http://localhost/PK9/` | The running site. EP307000 = *Employee Time Activities* |

## Common tasks → where
| I want to… | Go to |
|---|---|
| Change the stopwatch Pause/Stop logic or defaults | `src/Code/EmployeeActivitiesEntry_Extension.cs` |
| See/change the custom fields on time activities / filter | `src/DACs/` (attribute snippets; live code is `PK9\App_RuntimeCode\PX_Objects_*_extensions.cs`) |
| Change the Modern UI layout of EP307000 (buttons, columns, date filter) | `src/FrontendSources/screens/EP/EP307000/extensions/` — syntax in `..\Acumatica-PK-TimeClock\docs\T290.md` |
| Type-check Modern UI TypeScript | `tools/Test-ModernUI.ps1` |
| Look at base Acumatica logic being extended | `reference/base-code/` |
| See what the legacy screen looked like | `docs/screenshots/` |
| Retire this project | `scratchpad.md` → Retirement plan (and `..\Acumatica-PK-TimeClock\scratchpad.md` Phase 5) |
