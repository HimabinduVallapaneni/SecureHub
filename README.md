# SecureHub

SecureHub is a security findings and remediation management application.

It provides a centralized platform for managing:

- Applications
- Security findings
- Finding severity and ownership
- Remediation and retesting
- Security exceptions
- Security reports
- Application settings
----------------------------------------------------------------------------------------------------------------------
## Architecture
```text
┌──────────────────────────┐           ┌─────────────────────────┐            ┌─────────────────────────────┐
│      FRONTEND            │           |   BACKEND               |            |  DATABASE                   |
│                          │ REST API  |                         | SQLAlchemy |                             |
│    React + Vite          │---------->|  Python + FastAPI       |----------->| PostgreSQL                  |
│                          │           |                         |            |                             |
│ User Interface/Dashboard │           | Application / API Logic |            | Persistent Application Data |
└──────────────────────────┘           └─────────────────────────┘            └─────────────────────────────┘
```
      
-------------------------------------------------------------------------------------------------------------------------------------------
## Project Structure
```text
SecureHub/
│
├── BackEnd/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── requirements.txt
│   └── .env.example
│
├── FrontEnd/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   └── vite.config.js
│
├── docs/
│   └── ARCHITECTURE.md
│
├── .gitignore
└── README.md
```
----------------------------------------------------------------------------------------------------------------------------------------------
## Requirements

To run SecureHub locally, the following are required:

### Backend

- Python 3
- Dependencies listed in `BackEnd/requirements.txt`

### Frontend

- Node.js
- npm
- Dependencies defined in `package.json` and `package-lock.json`

### Database

- PostgreSQL

SecureHub requires a PostgreSQL database.

The database is **not included with the source code**.

Anyone running the application must provide a PostgreSQL instance and configure SecureHub to connect to it.

For local development or DevOps testing, PostgreSQL can be:

- Installed locally, or
- Run as a Docker container

### The application requires the following environment variable:
DATABASE_URL
The expected format is documented in:
BackEnd/.env.example
----------------------------------------------------------------------------------------------------------------------------------------

## Local Setup

### 1. Provide PostgreSQL

Create or start a PostgreSQL instance.

Create a database for SecureHub and note:

```text
Database host
Database port
Database name
Database username
Database password
```
### 2. Configure Backend Environment

The repository contains:

```text
BackEnd/.env.example
```

This file documents the environment variables required by the application.

For local execution, create:

```text
BackEnd/.env
```

and provide your own database connection:

```text
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
```
`.env` contains environment-specific credentials and must not be committed to Git.


### 3. Install Backend Dependencies

From the `BackEnd` directory:

```bash
python -m pip install -r requirements.txt
```

### 4. Start Backend

From the `BackEnd` directory:

```bash
python -m uvicorn main:app --reload
```
The host and port may be changed according to the local or deployment environment.

### 5. Install Frontend Dependencies

From the `FrontEnd` directory:

```bash
npm install
```

### 6. Start Frontend

```bash
npm run dev
```
The frontend development server will display the local address assigned by the development environment.

## Configuration

The application currently requires:

```text
DATABASE_URL
```
Use:
```text
.env.example
```
as the configuration template.

Do not store real passwords, tokens, API keys, or other secrets in the Git repository.

----------------------------------------------------------------------------------------------------------------------------------------------
## Developer Handoff

The repository provides the application source code and the information required to build and run SecureHub.

A DevOps engineer is responsible for providing the runtime environment, including:

```text
Application Source
       │
       ▼
Runtime Dependencies
       │
       ▼
Application Configuration
       │
       ▼
PostgreSQL Database
       │
       ▼
Backend
       │
       ▼
Frontend
       │
       ▼
Running SecureHub
```
