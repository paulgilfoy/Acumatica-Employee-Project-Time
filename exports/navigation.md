# exports/ — exported customization package (read-only snapshot)

| File | Contents |
|---|---|
| `ProjectTime.zip` | Export of the `ProjectTime` project (contains only `project.xml`) |
| `project.xml` | Same XML unzipped: `product-version="21.211"`; Classic page customization of `~/pages/ep/ep307000.aspx` (grid columns, Pause/Stop callback commands), Automation#EP307000, graph extension code |

**Known gap:** this export does **not** contain the Modern UI files (`PerTenantFile` items). The live PK9 project has them
(see `../src/navigation.md`). If a deployable package is ever needed again, re-export from PK9 (Customization Projects → Export), or build one like
`..\Acumatica-PK-TimeClock\tools\Build-Package.ps1` does (`PerTenantFile` + zip entries). Do not hand-edit this export.
