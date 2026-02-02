# Test Data Scenarios

Use these templates to generate complex genealogical datasets for unit and integration tests.

## 1. The Standard Nuclear Family
- **Goal**: Basic validation of parents/children arrays.
- **Structure**: 2 Parents, 2 Children.

## 2. The Blended Family
- **Goal**: Verify spouse and half-sibling logic.
- **Structure**: 
  - Parent A + Parent B (1 child)
  - Parent B + Parent C (1 child)
  - Result: Children share one parent but have different "spouses" in the parent's history.

## 3. The 4-Generation Pedigree
- **Goal**: Stress test recursive tree traversal.
- **Structure**: 
  - Generation 0: Focus Person
  - Generation 1: 2 Parents
  - Generation 2: 4 Grandparents
  - Generation 3: 8 Great-Grandparents

## 4. The Edge Case: Missing Data
- **Goal**: Ensure UI resilience.
- **Structure**: Members with no parents, members with no birth dates, members with no spouses.

## Generation Pattern (TypeScript)
Always use UUIDs for `id` and maintain bi-directional links:
```typescript
{
  id: "uuid-p1",
  firstName: "John",
  lastName: "Doe",
  children: ["uuid-c1"],
  spouses: ["uuid-p2"]
}
```
