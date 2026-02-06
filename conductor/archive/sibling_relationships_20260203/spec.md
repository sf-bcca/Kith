# Specification: Sibling Relationships

## Overview
This track introduces formal support for sibling relationships within the Kith family history platform. Currently, siblings are not explicitly modeled or visualized, making it difficult to represent complex family structures. This feature will implement a hybrid data model to support biological, step, and adopted siblings, along with a dedicated management interface and visualization updates.

## Functional Requirements
- **Data Modeling:** 
    - Implement a hybrid approach: siblings are primarily derived from shared parents in the database.
    - Add a `siblings` field (array of UUIDs) to the `family_members` table to support manual links (e.g., when parents are unknown or for non-biological relations).
    - Support specific relationship types: Full, Half, Step, and Adopted.
- **Relationship Wizard:**
    - Integrate a "Relationship Wizard" into the `AddMemberModal`.
    - Allow users to specify siblings during the creation of a new member.
    - Provide options to link to existing members or create placeholders.
- **Visualization:**
    - Update `FamilyTreeView` and `HorizontalTree` to render siblings side-by-side.
    - Ensure branch lines correctly connect siblings to their shared parent(s).
    - Highlight siblings when a member's profile is viewed.

## Non-Functional Requirements
- **Data Integrity:** Ensure that adding a manual sibling link triggers a check for existing parent-based links to avoid redundancy.
- **Performance:** Optimized tree traversal logic to calculate implied siblings without significant latency in large trees.

## Acceptance Criteria
- [ ] Users can add a sibling to a new or existing member via a "Relationship Wizard."
- [ ] The system correctly identifies half-siblings (sharing one parent) vs. full siblings (sharing two).
- [ ] Siblings are displayed side-by-side in the main family tree visualization.
- [ ] Step-siblings and adopted siblings can be manually linked and are visually distinguishable (e.g., dashed lines or labels).

## Out of Scope
- Automated DNA matching to suggest siblings.
- Sibling-specific social "groups" or shared chat rooms (reserved for future social tracks).
