# Implementation Plan: Date of Death Input and Display

## Phase 1: Database & API (Kith API Bridge) [checkpoint: 281375d]
- [x] Task: Create a new SQL migration `server/migrations/008_add_death_place.sql` to add `death_place` to the `family_members` table. [2f0ca6d]
- [x] Task: Update `server/SCHEMA.md` using the `kith-schema-maintainer` skill to reflect the new column. [d6ed12d]
- [x] Task: Update `services/FamilyService.ts` to map the `death_place` database field to the `deathPlace` TypeScript property. [e2a7ad6]
- [x] Task: Create a backend test in `tests/members.test.ts` to verify that both `death_date` and `death_place` are correctly persisted and retrieved via the API. [9c82553]
- [x] Task: Conductor - User Manual Verification 'Backend Infrastructure' (Protocol in workflow.md) [281375d]

## Phase 2: Frontend Data Entry (TDD)
- [x] Task: Create a test in `components/__tests__/AddMemberModal.test.tsx` to verify that checking the "Deceased" box reveals the death-related input fields. [02ebc39]
- [x] Task: Update `components/AddMemberModal.tsx` to include a "Deceased" checkbox, a "Date of Death" input, and a "Place of Death" input. [02ebc39]
- [x] Task: Create a test in `components/__tests__/MemberBiography.test.tsx` to verify the same behavior in the biography edit mode. [7be8928]
- [x] Task: Update `components/MemberBiography.tsx` to include the "Deceased" toggle and death-related inputs in the edit view. [7be8928]
- [x] Task: Implement client-side validation in both components to ensure the Date of Death is not in the future and is after the Date of Birth. [7be8928]
- [ ] Task: Conductor - User Manual Verification 'Data Entry' (Protocol in workflow.md)

## Phase 3: Frontend Visualization & Verification
- [x] Task: Verify that `FamilyTreeView.tsx` correctly displays lifespans (e.g., "1920 - 2005") for deceased members.
- [x] Task: Verify that `FamilyDirectory.tsx` correctly displays lifespans in the member list.
- [x] Task: Verify that `HorizontalTree.tsx` correctly displays lifespans in its node components.
- [x] Task: Verify that the `MemberBiography.tsx` timeline correctly displays the "Deceased" event with the date and place.
- [x] Task: Conductor - User Manual Verification 'Visual Display' (Protocol in workflow.md)

## Phase 4: Documentation Cleanup
- [x] Task: Use `kith-doc-maintainer` to update `AGENTS.md` and `README.md` if any significant architectural changes were made.
