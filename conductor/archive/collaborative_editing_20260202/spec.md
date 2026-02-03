# Specification: Collaborative Editing and Admin Dashboard

## Overview
This track focuses on transitioning Kith from a primarily read-only experience to a fully collaborative platform. It also aims to dynamize the Admin Dashboard to provide real-time insights into the family network.

## Goals
- Allow users to edit and delete any family member (collaborative editing).
- Implement a functional Admin Dashboard with real statistics and an approval queue.
- Complete the backend implementation for activity approvals.

## User Stories
- As a user, I want to correct information for any family member to ensure the tree is accurate.
- As an administrator, I want to see real statistics about my family network (total members, active trees).
- As an administrator, I want to review and approve changes or new activities to maintain data quality.

## Features to Implement

### 1. Collaborative Editing
- **Frontend:**
    - Update `MemberBiography.tsx` to show the "Edit" button for all members.
    - Add a "Delete" button in the edit mode of `MemberBiography.tsx`.
    - Implement a "Confirm Delete" modal.
- **Backend:**
    - Ensure `PUT /api/members/:id` and `DELETE /api/members/:id` handle requests correctly (currently they might have strict IDOR checks that need to be relaxed or changed to role-based checks).

### 2. Dynamic Admin Dashboard
- **Backend:**
    - Implement `GET /api/admin/stats`: Returns counts for members, activities, and pending items.
    - Implement `GET /api/admin/pending`: Returns a list of activities or member edits awaiting approval.
- **Frontend:**
    - Update `AdminDashboard.tsx` to fetch data from these new endpoints.
    - Replace hardcoded stats with dynamic values.

### 3. Activity Approvals
- **Backend:**
    - Implement `PATCH /api/activities/:id/approve` to change status from 'pending' to 'approved'.
- **Frontend:**
    - Show 'Approve' buttons in the Admin Dashboard for pending activities.

## Technical Requirements
- Follow TDD for all new backend endpoints.
- Maintain >80% test coverage.
- Ensure all mutations are protected by JWT authentication.
