# ProjectTime (EP307000 stopwatch, RETIRING) — Agent Scratchpad

> **Living document.** Every agent: read this top to bottom before working, claim your work in
> [Work claims](#work-claims), and update [Learnings](#learnings) / [Session log](#session-log) before you finish.
> The sister project `..\Acumatica-PK-TimeClock\` (screen PKEP3001) is the style and engine reference; its `scratchpad.md` is its master plan.

Last updated: 2026-11-13, session 4 (code moved to PK-TimeClock).
**State:** still live on PK9 and on the live site, **but its code has moved.** User decision 2026-11-13
(PK-TimeClock **D16**): EP307000 stays in use for a couple more years alongside PKEP3001, and **all clock code lives in
`Acumatica-PK-TimeClock`** (project `PKTimeClock`). This project is unpublished in the same publish that ships the new
PKTimeClock package (checklist: `..\Acumatica-PK-TimeClock\scratchpad.md` → Phase 5).
**Don't change `src/` here.** It mirrors what is live until the cutover, then it is history. EP307000 work happens in PK-TimeClock.

## Read order for a new agent
1. This file. 2. `navigation.md`, then the `navigation.md` of the folder you touch.
3. `..\Acumatica-PK-TimeClock\docs\T290.md` before touching any `.ts` / `.html`.
4. `..\Acumatica-PK-TimeClock\docs\reference.md` §1 for how the legacy clock behaves.
5. `..\Acumatica-PK-TimeClock\src\Code\PKEmployeeActivitiesEntryExt.cs` (the clock engine on the same graph) before changing Stop/Pause.

## What this project is
Customization project **`ProjectTime`**: lets employees enter time activities as a stopwatch on *Employee Time Activities* (EP307000).
- Custom fields on `PMTimeActivity` (`UsrPGClockStatus` A/P/C, `UsrPGIsPaused`, `UsrPGEndDate`, `UsrPGProgressStartTime/EndTime/TimeSpent`) and on the filter (`UsrPGFromDate`, `UsrPGTillDate`).
- Graph extension on `EmployeeActivitiesEntry`: defaults + `Pause_Timer` / `Stop_Timer` actions.
- Modern UI extension of EP307000 (buttons, filter dates, clock columns).

## What is live on PK9 (verified 2026-11-13)
| Layer | Source here | Live copy | Status |
|---|---|---|---|
| Graph extension | `src/Code/EmployeeActivitiesEntry_Extension.cs` | `PK9\App_RuntimeCode\EmployeeActivitiesEntry.cs` | Identical at session 1 (SHA-256 match). **Source has differed since session 2** (Until default; not published). |
| DAC extensions | `src/DACs/*.cs` (snippets) | `App_RuntimeCode\PX_Objects_CR_PMTimeActivity_extensions.cs`, `..._CR_OwnedFilter_extensions.cs` | Same attributes (compared by eye) |
| Modern UI | `src/FrontendSources/screens/EP/EP307000/extensions/EP307000_PKTimeClock.{ts,html}` | `PK9\FrontendSources\screen\src\customizationScreens\Company\screens\EP\EP307000\extensions\` | Identical to the site files (copied 2026-11-13); `Test-ModernUI.ps1` = OK |
| Project owner of the Modern UI files | — | DB: `CustObject` of project `ProjectTime` (CompanyID 2), `PerTenantFile#screens\EP\EP307000\extensions\EP307000_PKTimeClock.*`, last modified 2026-08-24 | Not in `exports/project.xml` |

## Dependencies (must stay published together)
| Dependency | Why |
|---|---|
| `PKTimeClock` (`Acumatica-PK-TimeClock`) | Its engine `PKEmployeeActivitiesEntryExt` extends the same graph; this project's extension also runs inside it. Its Date `FieldDefaulting` throws an NRE if the row is null — PKTimeClock always passes a Date on insert. PKTimeClock reads/writes this project's `UsrPG*` fields and reads the clock state the legacy buttons leave behind (stale segments, `UsrPGProgressStartTime`). |
| `Contact`, `ProjectTask` | Existing projects on PK9, unrelated to this code |

## Open items
| # | Item | Owner |
|---|---|---|
| 1 | `exports/project.xml` / `ProjectTime.zip` (and identical `builds/`) predate Modern UI (product-version 21.211). Decide: re-export from PK9, or keep as a historical snapshot. See P1. | user |
| 2 | **Done 2026-11-13:** direction confirmed by the user (D16 in PK-TimeClock). PK-TimeClock Phase 5 rewritten; `CLAUDE.md` / `README.md` here updated. | — |
| 3 | Legacy start-time field reads 1 h off (`UsrPGProgressStartTime`: `UseTimeZone`, no `PreserveTime`). See `..\Acumatica-PK-TimeClock\scratchpad.md` Open items. Goes away for the buttons once they use the engine (A1). | agent |
| 4 | Act on the [Code review](#code-review-2026-11-13) below. The user has their own improvement list; merge it with these findings before starting work. | user / agent |
| 5 | **Decided 2026-11-13 (A2 → b, plus the filter and fields):** everything moves to `PKTimeClock`; `ProjectTime` is unpublished. | — |

## Code review (2026-11-13)

> **Status (session 4):** implemented in `Acumatica-PK-TimeClock` (D16), not here. Fixed there: R1–R12, R14–R18, R21,
> M1–M3. **R20 overruled by the user:** a row added by hand on EP307000 *should* start a clock automatically. Kept, but
> now only for UI inserts on EP307000 and with a segment, instead of a DAC default on every time activity. Partly: R13 (null/owner checks, adapter signatures; buttons are not enabled/disabled per row), R19 (redundant
> columns hidden, not dropped). Not done: M4 (live ticker, PKEP3001 backlog). P1–P4 are about this repo and become moot
> once `ProjectTime` is unpublished. Old → new: `EmployeeActivitiesEntry_Extension` → `PKEmployeeTimeActivitiesExt`;
> `PMTimeActivityExt` → `PKTimeActivityExt` (same `UsrPG*` columns); `UsrPGFromDate`/`UsrPGTillDate` → unbound
> `UsrPKFromDate`/`UsrPKUntilDate`; `Stop_Timer`/`Pause_Timer` → `StartTimer`/`ToggleTimer`/`StopTimer`/`CloseTimerWithoutTime`.

**Scope:** everything under `src/` (graph extension, DAC snippets, Modern UI `.ts`/`.html`), `exports/project.xml`, and
`builds/`. Base behaviour checked against `reference/base-code/PX.Objects.EP.EmployeeActivitiesEntry.cs`. That file is an
**older** base version, not 26R2. Each finding marked *verify on PK9* still needs checking against
`PK9\App_Data\CodeRepository\PX.Objects\EP\EmployeeActivitiesEntry.cs` and `PK9\FrontendSources\screen\src\screens\EP\EP307000\`.
That site is on the Windows machine and was not reachable from this session. Nothing was compiled, type-checked or published.
Compared with `..\Acumatica-PK-TimeClock\src\` for the house style and the existing engine.

**A1?** = fixed (✔) or partly fixed (½) by [A1](#approach-reuse-pktimeclock-dont-reinvent): making Stop/Pause call the PKTimeClock engine.

### High: wrong behaviour today
| # | Finding | Where | A1? |
|---|---|---|---|
| R1 | **The `activity()` override drops the base filters.** The extension pastes a 2021 copy of the base delegate and leaves out the whole `FromWeek` / `TillWeek` / `IncludeReject` block (base lines 217–249). On EP307000, *From Week*, *Till Week* and *Include Rejected* therefore do nothing. Because the copy replaces the base delegate entirely, it also misses every change Acumatica has made to `activity()` since 2021. The base `EPActivityApprove_Date_FieldVerifying` still checks dates against `FromWeek`/`TillWeek`, so the week fields keep *validating* rows they no longer *filter*. *Verify on PK9* against the 26R2 delegate. Fix: copy the delegate again from 26R2 CodeRepository and add only the From/Until `WhereAnd` lines, or drop the custom dates in favour of the week filter. | `EmployeeActivitiesEntry_Extension.cs:28-82` | |
| R2 | **The non-billable rule is hard-coded and out of date.** `ProjectID == 8285` (comment: "2023-Firm"; that project is now Finished) or `LabourItemID == 10893` → non-billable. Firm projects created after 2023 do not match, so their time is marked **billable** whenever a task is set. PKTimeClock already has the rule (D2/D14): `PKTimeClockRules.IsBillableLaborItem` and the engine's `ApplyBillable`. | `:192-195` | ✔ |
| R3 | **Stop/Pause set fields directly and skip events.** `row.TimeSpent`, `row.IsBillable`, `row.TimeBillable`, `row.Hold` and `ext.UsrPGProgressTimeSpent` are assigned as plain properties. This skips the base `Hold` FieldUpdated handlers (approver default and the parent `CRActivity` status, base `:706-723`, `:823`) and `TimeSpent`/`IsBillable` FieldUpdated (`GetTimeBillable`, `:748-764`). For a row with no task, `TimeBillable` keeps its old value. | `:179`, `:192-198`, `:239` | ✔ |
| R4 | **Cache misuse.** The code calls `SetValueExt` on `Base.Caches[typeof(PMTimeActivity)]` with an `EPActivityApprove` row, and calls `Cache.Update(pMTimeActivityExt)`, which passes a **cache-extension object** where a DAC row belongs. It only works because the final `Caches[typeof(EPActivityApprove)].Update(row)` persists the same object. The `EPActivityApprove` field events (including this graph's `CacheAttached` overrides) never fire for these fields. The engine uses `Base.Activity.Cache.SetValueExt<…>` throughout. | `:166-167`, `:183-188`, `:199`, `:223-252` | ✔ |
| R5 | **Error paths leave a half-updated row.** The 18-hour check and the "unique error" check throw *after* `UsrPGProgressEndTime` has been changed in the cache. If the user then presses Save, the half-finished state is written to the database. The "unique error" also fires for any entry with no `UsrPGProgressStartTime`, for example one created by hand or by import. | `:166-178`, `:226-238` | ✔ |
| R6 | **"Until" date: root cause still open (my session-2 fix is a workaround).** The filter compares `EPActivityApprove.date` (date and time) `LessEqual` against `UsrPGTillDate`, a `PXDBDateAndTime(PreserveTime)` field that holds midnight. Defaulting Until to today + 1 fixes only the *default*. If a user picks 11/13–11/13 by hand, entries from 11/13 are still hidden, and the field now shows tomorrow's date. Better fix: keep the default at today and query `date < Until + 1 day` (a `Required<>` parameter holding `Till.Value.Date.AddDays(1)`). After that, remove the `UsrPGTillDate_FieldDefaulting` handler added in session 2. | `:68-71`, `:86-90` | |
| R7 | **The `Date` FieldDefaulting handler is broken.** (a) When `row == null` it dereferences `row`, which throws a NullReferenceException. PKTimeClock avoids this only by always passing a Date. (b) It writes `row.Date` instead of `e.NewValue`. (c) `PXTimeZoneInfo.Now.Date` removes the time, so every entry made on EP307000 is stamped 00:00. Sorting within a day is then meaningless, and the result contradicts `EPSetup.RequireTimes`. (d) It overrides base `GetNextActivityStartDate`, which places a new entry after the last entry of the day, and also the base `IsImport` exit. Fix: delete the handler, or set `e.NewValue = PXTimeZoneInfo.Now` only when the row is not null. | `:124-137` | |
| R20 | **Every new row on EP307000 becomes an "Active" clock.** The `UsrPGClockStatus` FieldDefaulting handler (→ "A") and the `UsrPGProgressStartTime` handler (→ now) fire for *every* inserted row, including time typed in by hand. Those rows match PKEP3001's *My Clocks* query (`clockStatus = A or P`, Open, `PKTimeClockEntry.cs:349-370`), so manual entries show up there as **running clocks**. Pressing Stop on one adds the time since it was created on top of the minutes already typed in. This probably accounts for many of the 3,004 Open legacy entries in PK-TimeClock Phase 4. Fix: no default clock status. Start a clock only through an explicit **Start** action (A1); a manual entry has `UsrPGClockStatus = null` and is "not a clock". | `:93-121` | ½ |
| R21 | **Two clock engines on one graph disagree.** The legacy buttons do not write `PKTimeClockSegment` rows, they truncate where the engine rounds (D7), and they read the 1-hour-off `UsrPGProgressStartTime`. The engine then has to repair what they leave behind (`CloseStaleSegments`, its fallback to `UsrPGProgressStartTime` when no segment exists). As a result, a clock paused on EP307000 and resumed on PKEP3001 can come out with different minutes depending on which screen stopped it. | whole `#region Actions` | ✔ |

### Medium: fragile or likely to break
| # | Finding | Where | A1? |
|---|---|---|---|
| R8 | **Timer arithmetic.** `(int)t.TotalMinutes` drops the partial minute on every pause, so a clock paused and resumed often consistently under-counts (the engine rounds to the nearest minute, D7). See Open item 3 for the 1-hour offset. The 18-hour limit (1080) is a magic number (the engine uses `PKTimeClockLimits.MaxRunningHours`). | `:170-174`, `:230-234` | ✔ |
| R9 | **`IsBillable` uses "Replace Original"** on both `PMTimeActivity` and `EPActivityApprove`. The replacement attribute set dates from 21.211, so any attribute 26R2 has added to `IsBillable` since then is silently lost (for example the `PXUIVerify` "Billable Time must be other than zero" that PKTimeClock D14 relies on; check whether it sits on `TimeBillable` or `IsBillable`). The export also replaces `Date` on both DACs (`PXDefault(businessDate)`); this is not in `src/DACs`, so check whether it is still in the live project. *Verify on PK9* with `..\Acumatica-PK-TimeClock\tools\Inspect-Acumatica.ps1 PMTimeActivity -Member IsBillable -Attributes`. Prefer `PXMergeAttributes(Merge)` plus only the attribute that actually differs, or no override at all. | `src/DACs/CR.PMTimeActivity.cs`, `EP.EPActivityApprove.cs` | |
| R10 | **Field defaults set on `PMTimeActivity` apply to every time activity in the system** (timecards, CR activities, field-service appointments, imports), not just EP307000. `UsrPGProgressStartTime` has `PXDefault(businessDate)` with no `PersistingCheck.Nothing`, so it is required on save everywhere and gets business-date midnight. `UsrPGClockStatus` has no default outside this graph and is therefore `null`. Use `PersistingCheck.Nothing` and no declarative default on the clock fields; set them only when a clock starts (goes with R20). | DAC snippets | |
| R11 | **Filter fields are declared in the wrong place and with the wrong type.** `UsrPGFromDate`/`UsrPGTillDate` are `PXDBDateAndTime` ("DBTableColumn") on an **unbound** filter, and are declared twice: on `CR.OwnedFilter`, which many CR screens share, and on `PMTimeActivityFilter`. They should be unbound `PXDate` fields on a `PXCacheExtension<PMTimeActivityFilter>` only. There is also no From > Until check; the base graph does this for weeks at `:330-342`. | `src/DACs/PMTimeActivityFilter.cs` | |
| R12 | **Clock fields can be edited in the grid.** The base `EPActivityApprove_RowSelected` enables every field on Open rows, so users can type over `UsrPGClockStatus`, the Start/End times and `UsrPGProgressTimeSpent`, and corrupt what the engine reads. Disable them in a `RowSelected` handler, or with `PXUIField(Enabled = false)`. | DAC snippets / extension | |
| R13 | **Actions are not defensive.** `Base.Activity.Current` is used without a null check, which throws a NullReferenceException when no row is selected. The actions use a `void` signature instead of `IEnumerable x(PXAdapter adapter)`. Nothing enables or disables Stop/Pause based on the row's status, so in Modern UI they are always clickable, and the "Pause/Play" caption never changes (PKEP3001 switches its link between Pause and Resume, `PKTimeClockEntry.cs:386`). There is no owner check: on EP307000 a delegate or proxy could stop someone else's clock; the engine's `LoadOwnOpenEntry` blocks that. | `:150-153`, `:209-212` | ½ |
| R14 | **The extension declares a second `Filter` view** (`public PXFilter<…> Filter;`) that shadows `Base.Filter`; it should use `Base.Filter`. `GetExtension<OwnedFilterExt>(filterRow)` is called *before* the `filterRow == null` check. | `:24`, `:32-37` | |

### Low: cleanup (bring in line with PKTimeClock house style)
| # | Finding | A1? |
|---|---|---|
| R15 | Magic strings `"OP"`, `"A"`, `"P"`, `"C"`. Use `ActivityStatusListAttribute.Open` and **`PKClockStatus`** (`PKTimeClockConstants.cs`, which already has constants, BQL constants and a `ListAttribute` for this exact field). `PXDBString(2)` holds 1-character codes; leave it, since the column exists. | ½ |
| R16 | Error messages are not localizable, name "Paul", and cite stale line numbers ("Line 169/229"). `return;` after `throw` is unreachable (CS0162 warning). The status column label "Active Clocks" is misleading. PKTimeClock keeps every string in a `[PXLocalizable]` messages class (`PKTimeClockMessages`). | ½ |
| R17 | Dead code: unused `pMTimeActivityExt` locals, `if (row == null)` / `else` branches that are identical, unused `using`s (`PX.SM`, `PX.Api`, `PX.Objects.IN`, `PX.TM`, …), commented-out code, mixed tabs and spaces. | |
| R18 | Conventions: the class lives in Acumatica's namespace `PX.Objects.EP` with the generic name `EmployeeActivitiesEntry_Extension`; the file name `EmployeeActivitiesEntry` is on PKTimeClock's "taken" list. There is no `public static bool IsActive()`. Handlers use the classic `Dac_Field_Event` signatures instead of typed `Events.FieldDefaulting<…>`. PKTimeClock style: own namespace, `PK` prefix, `IsActive() => true`, typed `_(Events.X<Dac, field> e)` handlers, `<summary>` comments that state the rule and the decision number. | |
| R19 | Redundant fields: `UsrPGIsPaused` duplicates `UsrPGClockStatus == "P"`, and `UsrPGEndDate` duplicates the date part of `UsrPGProgressEndTime`. Keep the columns (data, and the engine writes them) but stop showing them. | |

### Modern UI (`EP307000_PKTimeClock.ts/.html`)
| # | Finding |
|---|---|
| M1 | The Stop and Pause buttons sit in a custom `div` under the filter form rather than in the **Activity grid toolbar**, so it is not obvious they act on the selected grid row. Move them to the grid toolbar, enable them per row (needs R13), and add **Start** (R20). Syntax is in `..\Acumatica-PK-TimeClock\docs\T290.md` §5–6. Note T290's rule that declaring `PXActionState` removes the action from the main toolbar. |
| M2 | Filter field placement is specified twice (`@placeAfterProperty("TillWeek")` in `.ts` and `after="#fs-Dates [name='TillWeek']"` in `.html`). If `#fs-Dates` or `TillWeek` is renamed in a later base version, an `after=` selector **fails silently** and publish still succeeds. *Verify on PK9* against 26R2 `EP307000.html`. Keep one placement method. |
| M3 | The grid has 8 clock columns, including separate date and time halves for both Start and End, plus the redundant IsPaused/EndDate. Reduce to Status, Start time and Progress minutes; hide the rest by default. Consider PKEP3001's row colours (green active / yellow paused, D6) for consistency. |
| M4 | The screen shows no live elapsed time. PKEP3001 has *Elapsed* (`PKClockEntry.RunningSince`) and a 60 s refresh, and its backlog lists a per-second ticker (pattern EP309000.ts). If built, reuse that pattern on both screens. |

### Repo and packaging
| # | Finding |
|---|---|
| P1 | `exports/` and `builds/` contain identical files from 21.211. The export is stale in more ways than Open item 1 says: it has no From/Until fields, no 18-hour check, no `Save.Press()` in Pause, uses `DateTime.Now`, and has no Modern UI files. `builds/` is not listed in `navigation.md`. PKTimeClock builds its package from `src/` with `tools/Build-Package.ps1`; this repo has no equivalent, so `src/` cannot yet be turned into a package. |
| P2 | Line ranges in `README.md` and `src/navigation.md` ("118–277", "170–277") are wrong. The file is 259 lines; the actions are at about `:146-256`. |
| P3 | The DAC snippets were compared with the live `App_RuntimeCode` "by eye" only. Diff them properly before using `src/DACs` as the source of truth. |
| P4 | `CLAUDE.md`, `README.md` and the header of this file used to say "LEGACY, retire". The header is updated; `CLAUDE.md` / `README.md` still need it once the user confirms Open item 2. |

### Approach: reuse PKTimeClock, don't reinvent
- **A1: the legacy buttons call the engine.** `PKEmployeeActivitiesEntryExt` (PKTimeClock) is a graph extension on the same
  `EmployeeActivitiesEntry` and has public `PKPauseClock(noteID)`, `PKResumeClock(noteID)` and `PKStopClock(noteID, addRunningTime)`. These already handle
  segments, nearest-minute rounding (D7), the 18 h limit, `ApplyBillable` (D2/D14), Hold off + Save (D8), owner and
  status checks, and localizable messages. `Stop_Timer` becomes roughly
  `Base.GetExtension<PKEmployeeActivitiesEntryExt>().PKStopClock(row.NoteID.Value, true)`, and `Pause_Timer` calls Pause
  or Resume depending on `UsrPGClockStatus`. That replaces about 110 lines and fixes R2–R5, R8 and R21 in one change.
  Missing piece: the engine has no "start a clock on an *existing* EP307000 row" (`PKStartClock` creates a new entry from a
  project and task). A Start action for R20 needs either a small new public engine method or the EP307000 action
  inserting the row and then calling the engine.
- **A2: where the code lives (user decision, Open item 5).**
  (a) Keep it in `ProjectTime` and call into PKTimeClock. `ProjectTime` then depends on `PKTimeClock` at compile time, so
  the two must always be published together (true already).
  (b) Move the EP307000 clock actions and Modern UI buttons into `PKTimeClock` (one clock owner). `ProjectTime` shrinks
  to the From/Until filter, and later the `UsrPG*` fields move too (PKTimeClock Phase 5 already plans that move).
  **Agent recommendation: (b).** One repo owns all clock behaviour; this repo owns the EP307000 filter and layout tweaks.
- **House style to copy** (from PKTimeClock): own namespace and `PK` prefix, unique Code file names, `IsActive()`, typed
  `Events` handlers, `SetValueExt` on `Base.Activity.Cache`, constants and messages classes, `<summary>` comments that state the rule,
  `tools/Test-Compile.ps1 -IncludeRuntimeCode` + `tools/Test-ModernUI.ps1` before handing over, `Build-Package.ps1` to
  package, and the user publishes.

### Suggested order
1. **R6 + R1 + R14**: filter correctness (seen every day). Small and independent of A2.
2. **R7**: Date default (also runs inside the PKTimeClock engine on every Start).
3. **A2 decision, then A1** (fixes R2–R5, R8, R21) **+ R20 + R13 + M1** (Start/Pause/Stop per row in the grid toolbar).
4. **R12 + R10 + R9 + R11**: DAC hygiene; do them together with the planned move of the `UsrPG*` fields.
5. M2/M3, then low-priority cleanup during whichever step above touches the same code. P1–P4 at any time.

## Coordination rules
1. Claim work below before editing; release when done. 2. Edit source only under `src/`.
3. Never publish customizations; never edit generated folders on PK9; never write to the DB without explicit user approval.
4. Record findings here, not just in chat. Same rules as `..\Acumatica-PK-TimeClock\scratchpad.md` → Coordination rules.
5. Don't edit `..\Acumatica-PK-TimeClock\` from this repo; put needed changes there in Open items (PKTimeClock's rule too).

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
- The extension's `activity()` view delegate **replaces** the base delegate completely; the base one does not run. Any base filter that is not copied in is lost (see R1).
- `EPActivityApprove.Hold` is an unbound `PXBool`. Its side effects (approver default, parent `CRActivity` status) run only through FieldUpdated, so set it with `SetValueExt`, not by assigning the property.
- `reference/base-code/` is older than 26R2. Check any base-behaviour claim against `PK9\App_Data\CodeRepository` before changing code.
- PKTimeClock already owns a clock engine, `PKClockStatus` constants and a messages class for the same `UsrPG*` fields. Reuse them; don't duplicate them here.

## Session log
| Date | Session | Summary |
|---|---|---|
| 2026-11-13 | 1 | Pulled the Modern UI work (EP307000 extension .ts/.html) from PK9 into `src/FrontendSources`; verified C# is unchanged vs `App_RuntimeCode`; restructured the repo on the PK-TimeClock model (src/, docs/, reference/, exports/, tools/); added CLAUDE.md, scratchpad.md and navigation.md files; copied `tools/Test-ModernUI.ps1`; updated README and the PK9 / PK-TimeClock pointers. Not committed. |
| 2026-11-13 | 2 | Added `PMTimeActivityFilter_UsrPGTillDate_FieldDefaulting` to `src/Code/EmployeeActivitiesEntry_Extension.cs`: default "Until" = today + 1 (Modern UI treats Until as 00:00:00, hiding today's entries). Source only — not compiled, not published; `App_RuntimeCode` copy now differs until the user publishes. Review R6 says to replace this with a query-side fix. |
| 2026-11-13 | 3 | Full code review (dev-toolkit `acumatica-customization-update` skill) of `src/`, exports and builds, against `reference/base-code` and `Acumatica-PK-TimeClock` (engine, rules, constants, T290). Wrote the [Code review](#code-review-2026-11-13) section: 21 code findings (R1–R21), 4 Modern UI (M1–M4), 4 repo (P1–P4), plus approach A1/A2. Recorded the user's direction change (EP307000 maintained for years). Review only: no code changed, nothing compiled. PK9 (Windows) not reachable from this Mac session, so the *verify on PK9* items are open. |
| 2026-11-13 | 4 | User decision (PK-TimeClock D16): all clocks in one repo, EP307000 kept for years, plus row colors (green running, yellow paused, red "Completed" text). Implemented in `Acumatica-PK-TimeClock` (see its scratchpad, session 4); `ProjectTime` will be unpublished at the cutover. Here: reverted the unpublished session-2 Until change so `src/` = live again; status, `CLAUDE.md`, `README.md` updated. |
| 2026-11-13 | 4b | New PKEP3001 features designed with the user (delete, Email button, FIRM description at Stop): recorded as D17–D19 / Phase 6 in `..\Acumatica-PK-TimeClock\scratchpad.md`. Work continues in that repo; nothing further planned here. |
