# src/ — customization source (→ customization project `ProjectTime`)

**This is the only place to edit customization code.** Claim the file or area in `../scratchpad.md` first.

| Folder | Becomes / is | Rules |
|---|---|---|
| `Code/EmployeeActivitiesEntry_Extension.cs` | Graph extension on `EmployeeActivitiesEntry` (EP307000): field defaults (lines ~118–165) and the `Pause_Timer` / `Stop_Timer` actions (~170–277). Live copy: `PK9\App_RuntimeCode\EmployeeActivitiesEntry.cs` (byte-identical as of 2026-11-13). | Also executes inside the PK Time Clock engine — see `../scratchpad.md` → Dependencies before changing. |
| `DACs/*.cs` | **Attribute snippets** (not compilable files) for the custom `UsrPG*` fields, as shown in the Customization Editor. Live generated classes: `PK9\App_RuntimeCode\PX_Objects_CR_PMTimeActivity_extensions.cs`, `..._CR_OwnedFilter_extensions.cs`. | `PMTimeActivity` (`CR.PMTimeActivity.cs`) is the base DAC; mirror changes of `EP.EPActivityApprove.cs` there. `PMTimeActivityFilter.cs` = filter fields (the same From/Until fields exist on `CR.OwnedFilter`). |
| `FrontendSources/screens/EP/EP307000/extensions/` | `<PerTenantFile AppRelativePath="screens\EP\EP307000\extensions\…" ScreenId="EP307000"/>` — the **Modern UI** layer | Path mirrors `PK9\FrontendSources\screen\src\screens\…`. Type-check with `../tools/Test-ModernUI.ps1`. Syntax: `..\Acumatica-PK-TimeClock\docs\T290.md`. |

## Modern UI files (added 2026-11-13, copied from the running PK9 site)
| File | Purpose |
|---|---|
| `EP307000_PKTimeClock.ts` | Screen extension (class names `EP307000_*_PKTimeClock`): declares `Stop_Timer` / `Pause_Timer` actions; adds From/Until (`UsrPGFromDate`, `UsrPGTillDate`) after *Till Week* in the Filter; adds grid columns `UsrPGClockStatus` (after *Time Billable*), `UsrPGIsPaused` (checkbox), progress start/end date + time (time mode, `t` format), `UsrPGProgressTimeSpent`, `UsrPGEndDate`. |
| `EP307000_PKTimeClock.html` | Template: From/Until fields in `#fs-Dates`; a `#div-TimeClockActions` h-stack under `#form-Filter` with the Pause and Stop buttons. |

> The file name carries the `_PKTimeClock` suffix for historical reasons, but in the PK9 database these two files belong to the **`ProjectTime`** project
> (CustObject `PerTenantFile#screens\EP\EP307000\extensions\EP307000_PKTimeClock.*`, modified 2026-08-24). Do not confuse them with the
> `PKTimeClock` project's own extensions (`PM101000` / `PM208000` / `PM301000`) in `Acumatica-PK-TimeClock`.
> They are **not** inside `exports/project.xml` (that export predates Modern UI); see `../scratchpad.md` → Open items.
