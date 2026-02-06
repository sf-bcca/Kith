---
name: kith-media-specialist
description: Expert guidance for implementing robust media handling, including file uploads (multipart/form-data), image optimization, storage strategies, and secure serving. Use when modifying MediaGallery, ActivityFeed, or backend media routes.
---

# Kith Media Specialist

This skill guides the transition from simple Base64 strings to a production-ready media pipeline.

## Core Workflows

### 1. Upload Pipeline
When implementing or refactoring media uploads:
- **Protocol**: Deprecate Base64 JSON payloads. Use `multipart/form-data` for all file transfers.
- **Middleware**: Use `multer` (or similar) in `server/routes/` to handle streams.
- **Validation**: Strictly validate MIME types (`image/jpeg`, `image/png`, `image/webp`) and file sizes (max 10MB) on the server.

### 2. Storage Strategy
- **Development**: Store files in `server/uploads/` (ensure this directory is in `.gitignore` but created if missing).
- **Production**: Design for S3-compatible object storage. Use an abstraction layer (Service pattern) to switch between Local/S3 providers.
- **Naming**: Sanitize filenames. Use UUIDs to prevent collisions: `{uuid}.{ext}`.

### 3. Image Optimization
- **Processing**: Use libraries like `sharp` to generate:
    - **Thumbnails**: 200x200px (cover) for galleries.
    - **Web-Ready**: Max 1920px width, converted to WebP/JPEG with 80% quality.
- **Originals**: Always keep the original file if storage permits, or a high-res master.

### 4. Metadata & Tagging
- **Extraction**: Extract EXIF data (Date Taken, GPS) upon upload to auto-populate fields.
- **Privacy**: Strip EXIF data from public-facing URLs to protect privacy, unless explicitly opted-in (e.g., for maps).

## Frontend Guidelines
- **Lazy Loading**: Always use `loading="lazy"` for images below the fold.
- **Placeholders**: Use blur-hash or solid color placeholders while images load.
- **Error Handling**: Gracefully handle 404s (broken images) with a fallback icon.