# Deployment Guide: IGNITERSS (Vercel + Render + Supabase)

This repository is pre-configured for instant zero-hassle cloud deployment across **Supabase**, **Render**, and **Vercel**.

---

## 🚀 Architectural Overview

| Tier | Provider | Directory | Purpose |
| :--- | :--- | :--- | :--- |
| **Database** | **Supabase** | `supabase/` | Managed PostgreSQL database storing all RailOps tables & records |
| **Backend** | **Render** | `backend/` | FastAPI REST API engine, LangGraph solver & scheduling logic |
| **Frontend** | **Vercel** | `frontend/` | React 18 + Vite + Tailwind CSS dashboard |

---

## Step 1: Set Up Supabase (PostgreSQL Database)

1. Go to **[supabase.com](https://supabase.com)** and sign in / sign up.
2. Click **New Project** and name it `igniterss-db` (choose your nearest region).
3. Set a strong database password (remember this password).
4. Once the project is created:
   - Navigate to **SQL Editor** on the left menu.
   - Click **New query**.
   - Copy and paste the entire contents of [`supabase/schema_and_seed.sql`](./supabase/schema_and_seed.sql).
   - Click **Run**. All 16 tables, indexes, and full initial datasets will be instantly created.
5. Retrieve your database connection string:
   - Go to **Project Settings** (gear icon) -> **Database**.
   - Under **Connection string**, select **URI**.
   - Mode: Choose **Transaction** or **Session** (or direct connection `db.<project-ref>.supabase.co:5432`).
   - Copy the URI. It looks like:
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
     *(Replace `[YOUR-PASSWORD]` with your actual Supabase database password)*.

> **Note**: Even if you skip running the SQL script manually, the FastAPI backend will automatically create tables and seed data upon connecting to your Supabase PostgreSQL instance via SQLAlchemy!

---

## Step 2: Deploy Backend on Render

1. Log in to **[render.com](https://render.com)**.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub account and select repository: **`igniterssih26/IGNITERSS`**.
4. Configure the Web Service settings:
   - **Name**: `igniterss-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Region**: Oregon or closest to your database
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. In **Environment Variables**, add:
   - `DATABASE_URL` = `<Your Supabase connection string from Step 1>`
   - `PYTHON_VERSION` = `3.11.9`
6. Click **Deploy Web Service**.
7. Once deployment finishes, Render will provide a public URL like:
   ```
   https://igniterss-backend.onrender.com
   ```
   Verify it by visiting `https://igniterss-backend.onrender.com/api/health`. It should return `{"status": "healthy", "database": "postgresql (Supabase / PostgreSQL)", ...}`.

---

## Step 3: Deploy Frontend on Vercel

1. Log in to **[vercel.com](https://vercel.com)**.
2. Click **Add New...** -> **Project**.
3. Import the repository: **`igniterssih26/IGNITERSS`**.
4. In the Project Configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `frontend`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `dist` (default)
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://igniterss-backend.onrender.com/api` *(Your Render backend URL followed by `/api`)*
6. Click **Deploy**.
7. In ~1 minute, your live frontend application will be published at:
   ```
   https://igniterss.vercel.app
   ```

---

## 🔒 Environment Variables Summary

### Render (Backend)
| Variable | Value Example | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres:pass@db.ref.supabase.co:5432/postgres` | Supabase Postgres URI |
| `PYTHON_VERSION` | `3.11.9` | Python runtime |

### Vercel (Frontend)
| Variable | Value Example | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://igniterss-backend.onrender.com/api` | Render backend endpoint |
