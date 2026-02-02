# Specification - Security Remediation 20260202

## Overview
This track focuses on remediating five security and privacy vulnerabilities identified during the recent audit. The goal is to move the application from a "trust-the-client" model to a secure, industry-standard authentication and data handling architecture.

## Functional Requirements

### 1. Broken Authentication & IDOR (Critical)
- **Goal:** Replace the `localStorage` based identity system with a secure JWT-based authentication flow.
- **Backend:**
    - Implement a `/api/auth/login` endpoint that issues a signed JWT upon successful credential verification.
    - Add an authentication middleware to protect all sensitive routes (e.g., `/api/members/:id`, `/api/settings/:id`).
    - Verify that the `id` in the request parameters matches the `sub` (subject) in the JWT to prevent IDOR.
- **Frontend:**
    - Update `FamilyService` to include the JWT in the `Authorization: Bearer <token>` header for all API calls.
    - Store the JWT securely (e.g., in memory or a secure cookie).

### 2. Plain Text Passwords (Critical)
- **Goal:** Ensure passwords are never stored or compared in plain text.
- **Backend:**
    - Use `bcrypt` to hash passwords before saving them to the database (during creation or updates).
    - Use `bcrypt.compare()` during the login process to verify credentials.

### 3. Password Exposure (High)
- **Goal:** Prevent sensitive credential data from leaving the server.
- **Backend:**
    - Update all member retrieval queries and controllers to explicitly exclude the `password` field from the response.
- **Frontend:**
    - Remove the `password` property from the `FamilyMember` TypeScript interface and all mapping logic.

### 4. Verbose Error Messages (Medium)
- **Goal:** Prevent internal system details from leaking to users.
- **Backend:**
    - Implement a centralized error handling middleware.
    - Ensure that production error responses only contain a generic message and an internal reference ID, while detailed logs are kept on the server.

### 5. CSS Injection / XSS (Medium)
- **Goal:** Mitigate injection vectors in the tree visualization.
- **Frontend:**
    - Implement a URL validation utility to ensure `photoUrl` uses safe protocols (`http:`, `https:`) and does not contain malicious characters that could break out of CSS `url()` blocks.

## Acceptance Criteria
- [ ] Users must be logged in to view or modify any family data.
- [ ] Database contains only hashed passwords (verified via manual DB check).
- [ ] API responses for member data do not include a `password` field.
- [ ] Attempting to access another user's settings with a valid token for a different user returns a `403 Forbidden`.
- [ ] Server errors return a generic `500 Internal Server Error` without stack traces or SQL details.
- [ ] Malicious `photoUrl` strings are blocked or sanitized before being rendered in the `FamilyTreeView`.

## Out of Scope
- Implementation of Multi-Factor Authentication (MFA).
- OAuth/Social Login integration.
- Rate limiting (though recommended for future tracks).
