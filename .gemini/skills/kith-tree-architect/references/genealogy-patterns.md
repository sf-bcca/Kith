# Genealogy Data Patterns

## Recursive Ancestry Traversal

When building an ancestry tree (Pedigree), use a depth-limited recursive approach to avoid infinite loops in case of data errors (though biological cycles are impossible, data entry errors can happen).

```typescript
async function getAncestors(id: string, depth: number, maxDepth: number) {
  if (depth > maxDepth) return null;
  const person = await FamilyService.getById(id);
  if (!person) return null;

  return {
    ...person,
    parents: await Promise.all(
      person.parents.map(pId => getAncestors(pId, depth + 1, maxDepth))
    )
  };
}
```

## Family Unit Consolidation

For modern family trees, a "Family Unit" consists of:
- Two partners (spouses/parents)
- Their shared children
- Children from previous relationships (blended family)

**Pattern:** Always center the view on a `FamilyGroup` ID rather than an individual when rendering "Family" views to ensure all siblings and half-siblings are visible.

## SVG Layout Calculations

For Fan Charts, use polar coordinates:
- `radius = generation * generationWidth`
- `angle = (index / totalInGeneration) * sweepAngle`
- `x = centerX + radius * cos(angle)`
- `y = centerY + radius * sin(angle)`
