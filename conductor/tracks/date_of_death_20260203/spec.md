# Specification: Date of Death Input and Display

## Overview
This track introduces the ability to record and display the Date of Death for family members. This allows users to distinguish between living and deceased members and accurately represent lifespans in the family tree and biographies.

## Functional Requirements
- **Add Member Modal:**
    - Add a "Deceased" checkbox.
    - When the "Deceased" checkbox is checked, a "Date of Death" date input field must appear.
    - The "Date of Death" field should be optional but recommended if the member is deceased.
- **Member Biography / Edit View:**
    - Add a "Deceased" checkbox in edit mode.
    - When checked, show the "Date of Death" date input field.
    - Allow updating these fields for existing members.
- **Validation:**
    - Ensure the "Date of Death" is not in the future.
    - Ensure the "Date of Death" is after the "Date of Birth".
- **Visual Display:**
    - In the Family Tree, Horizontal Tree, and Directory, show lifespan dates (e.g., "1950 - 2023") for deceased members.
    - For living members, continue showing "Born: [Year]" or "[Year] - Present" as per current design.
    - In the Member Biography timeline, ensure the death event is correctly displayed if present.

## Non-Functional Requirements
- **Consistency:** Maintain the existing UI aesthetic (Tailwind CSS, Material Symbols).
- **Responsiveness:** Ensure the new input fields fit well in the mobile-first design.

## Acceptance Criteria
- [ ] Users can mark a member as deceased in the "Add Member" modal.
- [ ] Users can add/edit the "Date of Death" for any member in their Biography view.
- [ ] Validation prevents entering a death date before birth or in the future.
- [ ] The lifespan dates are correctly displayed in the Family Tree and Directory.
- [ ] The "Date of Death" is correctly persisted to the database.

## Out of Scope
- Death certificates or external record linking.
- Cause of death fields.
- Funeral/burial location fields (unless birth_place pattern is easily extended).
