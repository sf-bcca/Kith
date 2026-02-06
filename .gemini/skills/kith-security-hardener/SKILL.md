---
name: kith-security-hardener
description: Enforces backend security best practices, transactional integrity for complex relationship updates, and centralized data sanitization. Use when modifying API endpoints, authentication logic, or database transactions.
---

# Kith Security Hardener

This skill ensures that the Kith backend adheres to strict security and data integrity standards.

## Core Workflows

### 1. Transactional Integrity
When modifying `server/routes/` or `server/services/` that involve multiple database writes (e.g., linking siblings, updating reciprocal relationships):
- **Atomic Transactions**: ALWAYS use `BEGIN`, `COMMIT`, and `ROLLBACK`.
- **No Orphans**: Ensure that if a member is deleted, their ID is removed from all `relationships` arrays (parents, children, spouses, siblings) of other members.
- **Race Condition Prevention**: Do not rely on application-level logic for constraints that can be enforced by the database (though complex JSONB updates often require application logic, wrap them in transactions).

### 2. Data Sanitization & Output
- **Sanitize on Exit**: NEVER return raw database rows that include the `password` column. Explicitly destructure it out: `const { password, ...safeMember } = result.rows[0];`
- **Type Safety**: Ensure the `FamilyMember` type in `server/` matches the database schema exactly, but the API response type excludes secrets.

### 3. Authentication & Authorization
- **Middleware Usage**: strictly use `authenticate` for all private routes. Use `authorizeAdmin` for system-level changes.
- **Context Awareness**: Always use `req.user.id` to validate ownership. Do not trust `req.body.userId` unless verifying it matches `req.user.id` or the user is an Admin.

### 4. Anti-Patterns to Remove
- **setTimeout Retries**: Remove any `setTimeout` retry loops in controllers (e.g., `GET /api/members/:id`). These mask race conditions. Fix the underlying data consistency issue instead.
- **Console.log leaks**: Do not log full member objects or PII in production.

## Guidelines
- **Input Validation**: Validate all incoming JSON payloads against strict types before processing.
- **Error Handling**: Use the central `errorHandler` middleware. Do not leak stack traces to the client in production.