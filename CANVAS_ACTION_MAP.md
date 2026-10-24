# Canvas Protocol action map

This audit records every current mutation trigger before the full Canvas Protocol conversion. Navigation, filters, search, step controls, field editing, window controls, and external links are not execution actions and remain conventional controls.

| Primary action | Current trigger and surface | Data card | Action Zone | Existing handler reused | Checkpoint |
| --- | --- | --- | --- | --- | --- |
| Create project | Project Draft card on the final create-form step | `project-draft` | Save to Archive | `ProjectForm.onSubmitProject` → `createProject` | Canvas 1 — converted |
| Add to Revisit Later | Project card in archive grids on desktop and mobile | `project-record` | Revisit Later | `toggleRevisitLater(id, true)` | Canvas 1 — converted |
| Remove from Revisit Later | Project card in the Revisit Later view | `project-record` | Return to Collection | `toggleRevisitLater(id, false)` | Canvas 1 — converted |
| Edit project and Memory Capsule | Save Changes button on final edit-form step | Updated Project / Memory Capsule Draft | Save Changes | `ProjectForm.onSubmitProject` → `updateProject` | Canvas 2 |
| Delete project | Delete button and Delete Permanently dialog button | Project card, then deletion confirmation card | Delete Project, then Confirm Permanent Deletion | `deleteProject` | Canvas 2 |
| Reset demo data | Reset Demo button and confirmation-dialog button | Current Archive Snapshot | Restore Demo Archive | `resetDemoData` | Canvas 2 |
| Reset demo data from terminal | `reset` command | Current Archive Snapshot | Restore Demo Archive | `resetDemoData` | Canvas 2; terminal bypass must be removed |
| Blocker Recheck | Not yet exposed in the current UI | Recheck Draft | Record Recheck | Future history-preserving update through `updateProject` | Canvas 2 |
| Shrink the Dream | Not yet exposed in the current UI | Work-item cards, then Scope Revision | Keep / Postpone / Remove from This Version, then Save Reduced Scope | Future history-preserving update through `updateProject` | Canvas 2 |
| Revival decision / archive path | Not yet exposed in the current UI | Revival Decision | Record Revival Decision | Future history-preserving update through `updateProject` | Canvas 2 |

## Non-executing controls retained

- Form Back/Continue step navigation, field inputs, technology/work-item row editing, search, filters, and sorting.
- Links that open create, details, edit, repository, and demo destinations.
- Desktop window, launcher, workspace, wallpaper, and navigation controls.
- Draft restore/discard currently manages incomplete browser-local form state rather than a persisted project record; it will receive a final compliance review in Canvas Checkpoint 2.

