---
name: kith-test-factory
description: Specialized in generating complex, realistic mock family datasets and unit tests for Kith. Use when updating mocks/familyData.ts, testing new tree traversal logic, or creating edge-case scenarios (blended families, orphans, many generations).
---

# Kith Test Factory

This skill automates the creation of high-fidelity test data and unit tests for the Kith genealogy engine.

## Core Workflows

### 1. Mock Data Generation
When asked to create test data:
- **Relational Integrity**: Ensure that if Person A is Person B's parent, Person B must have Person A in their `parents` array.
- **Diversity**: Generate varied names, dates, and locations.
- **Scenario Matching**: Use [test-scenarios.md](references/test-scenarios.md) to select a predefined family structure (e.g., "Blended Family").

### 2. Component/Service Testing
When writing tests in `__tests__/` or `services/`:
- **Vitest**: Use Vitest patterns (describe/it/expect).
- **Mock Services**: Mock `FamilyService` or `ActivityService` when testing UI components to ensure fast, isolated tests.
- **Snapshot Testing**: Use for tree visualizations to detect layout regressions.

## Guidelines
- **Scalability**: Don't just generate one member; generate the whole connected tree.
- **Realism**: Use logical dates (parents must be older than children).
- **Standardization**: Always adhere to the `FamilyMember` type in `types/family.ts`.