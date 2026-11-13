# Agent instructions — Acumatica-Employee-Project-Time

**Status: LEGACY.** This is the old stopwatch on EP307000 (`ProjectTime` customization). It is being retired in
favor of `Acumatica-PK-TimeClock` (screen `PKEP3001`). Change it only to support that switchover.

1. Read `scratchpad.md` first (status, what is live, coordination rules, work claims).
2. Use `navigation.md` (here) and the `navigation.md` in each folder to find things.
3. Hard rules:
   - Claim your area in `scratchpad.md` before editing; release it when done.
   - Never publish customizations; never write to the PK9 database without explicit user approval in the current conversation.
   - Edit source only under `src/`. Never edit generated folders in `C:\Program Files\Acumatica ERP\PK9`.
   - Run `tools/Test-ModernUI.ps1` after touching any `.ts` (type-check only). C# compile checks: use `..\Acumatica-PK-TimeClock\tools\Test-Compile.ps1 -IncludeRuntimeCode`.
   - Before finishing, update `scratchpad.md` (status, learnings, session log).
4. Shell is Windows PowerShell 5.1. git is not on PATH — see `..\Acumatica-PK-TimeClock\scratchpad.md` → Learnings.
5. The live PK Time Clock engine runs *inside* this project's graph extension — see `scratchpad.md` → Dependencies.
