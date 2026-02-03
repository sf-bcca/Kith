# Implementation Plan: Date of Death Input and Display

## Phase 1: Database & API (Kith API Bridge)
- [x] Task: Create a new SQL migration `server/migrations/008_add_death_place.sql` to add `death_place` to the `family_members` table. [2f0ca6d]
- [x] Task: Update `server/SCHEMA.md` using the `kith-schema-maintainer` skill to reflect the new column. [d6ed12d]
- [ ] Task: Update `services/FamilyService.ts` to map the `death_place` database field to the `deathPlace` TypeScript property.
- [ ] Task: Create a backend test in `tests/members.test.ts` to verify that both `death_date` and `death_place` are correctly persisted and retrieved via the API.
- [ ] Task: Conductor - User Manual Verification 'Backend Infrastructure' (Protocol in workflow.md)

## Phase 2: Frontend Data Entry (TDD)
- [ ] Task: Create a test in `components/__tests__/AddMemberModal.test.tsx` to verify that checking the "Deceased" box reveals the death-related input fields.
- [ ] Task: Update `components/AddMemberModal.tsx` to include a "Deceased" checkbox, a "Date of Death" input, and a "Place of Death" input.
- [ ] Task: Create a test in `components/__tests__/MemberBiography.test.tsx` to verify the same behavior in the biography edit mode.
- [ ] Task: Update `components/MemberBiography.tsx` to include the "Deceased" toggle and death-related inputs in the edit view.
- [ ] Task: Implement client-side validation in both components to ensure the Date of Death is not in the future and is after the Date of Birth.
- [ ] Task: Conductor - User Manual Verification 'Data Entry' (Protocol in workflow.md)

## Phase 3: Frontend Visualization & Verification
- [ ] Task: Verify that `FamilyTreeView.tsx` correctly displays lifespans (e.g., "1920 - 2005") for deceased members.
- [ ] Task: Verify that `FamilyDirectory.tsx` correctly displays lifespans in the member list.
- [ ] Task: Verify that `HorizontalTree.tsx` correctly displays lifespans in its node components.
- [ ] Task: Verify that the `MemberBiography.tsx` timeline correctly displays the "Deceased" event with the date and place.
- [ ] Task: Conductor - User Manual Verification 'Visual Display' (Protocol in workflow.md)

## Phase 4: Documentation Cleanup
- [ ] Task: Use `kith-doc-maintainer` to update `AGENTS.md` and `README.md` if any significant architectural changes were made.
