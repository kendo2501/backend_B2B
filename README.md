# Mini ERP Backend Sync to init.sql

This backend is aligned to the existing PostgreSQL schema from `init.sql`.
Use your current Docker and database; no extra DB bootstrap is required.

## What is included
- NestJS modular monolith
- Prisma schema mapped to existing tables
- Auth / RBAC
- Catalog
- Inventory
- Procurement
- Sales
- Finance
- Outbox publisher / worker
- BFF dashboard

## Run
1. Copy `.env.example` to `.env`
2. `npm install`
3. `npm run prisma:generate`
4. `npm run start:dev`
