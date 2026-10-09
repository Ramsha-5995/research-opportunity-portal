# University Research Opportunity Portal

**Name:** Ramsha Khalid
**Reg. No:** 24P-0522
**Class:** BS (CS-5A) | **Course:** Computer Networks (CN) 

A full-stack web application that lets faculty members post, view, update, and manage research opportunities in one place, replacing scattered emails, WhatsApp groups, and noticeboards.

**GitHub Repository:** https://github.com/Ramsha-5995/research-opportunity-portal

**Demo Video:** included in the submission ZIP

## Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript (vanilla, no framework)
- **API Testing:** Postman

## Project Structure

```
research-opportunity-portal/
├── backend/
│   ├── routes/
│   │   └── opportunities.js   # All CRUD route handlers and validation
│   ├── db.js                  # MySQL connection pool
│   ├── server.js              # Express app entry point
│   ├── schema.sql             # Database schema + sample data
│   ├── package.json
│   └── .env.example           # Copy to .env and fill in your DB credentials
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── postman_collection.json    # Postman collection (Collection v2.1)
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js (v18 or newer)
- MySQL Server (8.x) running locally
- A modern web browser
- Postman or Bruno (only needed for API testing)

## Setup Instructions

### 1. Set up the database

Make sure MySQL is installed and running, then run one of these from the **project root folder** (the folder that contains `backend` and `frontend`).

Command Prompt, Git Bash, Mac, or Linux:

```bash
mysql -u root -p < backend/schema.sql
```

PowerShell:

```powershell
mysql -u root -p -e "source backend/schema.sql"
```

If `mysql` is not recognized on Windows, use the full path to it, for example:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "source backend/schema.sql"
```

This creates the `research_portal` database, the `opportunities` table, and inserts two sample rows. Run it only once, because running it again inserts the sample rows a second time.

### 2. Configure and run the backend

```bash
cd backend
cp .env.example .env
# On Windows Command Prompt use: copy .env.example .env
# Open .env and set DB_PASSWORD to your MySQL password
npm install
npm start
```

The API starts on `http://localhost:5000`. You should see `Server running on http://localhost:5000` in the terminal. Keep this terminal open.

Environment variables (in `backend/.env`):

| Variable | Default | Description |
|---|---|---|
| `PORT` | 5000 | Port the API listens on |
| `DB_HOST` | localhost | MySQL host |
| `DB_USER` | root | MySQL user |
| `DB_PASSWORD` | (your password) | MySQL password |
| `DB_NAME` | research_portal | Database name |

### 3. Run the frontend

The frontend is plain HTML/CSS/JavaScript. Open a **second** terminal and either:

```bash
cd frontend
npx serve .
```

then open the address it prints (usually `http://localhost:3000`), or simply double-click `frontend/index.html` to open it in your browser.

The backend must be running first, because the frontend calls `http://localhost:5000/api/opportunities`.

## Features

- View all research opportunities loaded from the database
- View the complete details of a selected opportunity
- Create a new opportunity using a form
- Update an existing opportunity
- Change an opportunity's status between Open and Closed
- Delete an opportunity
- Success and error messages for every action
- Form validation on both the frontend and the backend

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/opportunities` | Create a new research opportunity |
| GET | `/api/opportunities` | Retrieve all research opportunities |
| GET | `/api/opportunities/:id` | Retrieve one opportunity by ID |
| PUT | `/api/opportunities/:id` | Update an opportunity (partial updates supported) |
| DELETE | `/api/opportunities/:id` | Delete an opportunity |

### Opportunity Object

```json
{
  "id": 1,
  "title": "AI in Healthcare Diagnostics",
  "description": "Research on using AI models for early disease diagnosis.",
  "research_area": "Artificial Intelligence",
  "faculty_name": "Dr. Sara Malik",
  "department": "Computer Science",
  "required_skills": "Python, Deep Learning",
  "available_positions": 2,
  "application_deadline": "2026-12-01",
  "status": "Open"
}
```

### Validation Rules

- `title`, `description`, `research_area`, `faculty_name`, `department`, `required_skills`, `available_positions`, and `application_deadline` are required when creating an opportunity
- `faculty_name` may contain only letters, spaces, dots, apostrophes, and hyphens (no numbers)
- `available_positions` must be a non-negative integer
- `application_deadline` must be a valid date (YYYY-MM-DD)
- `status` must be either `Open` or `Closed`

### Status Codes Used

- `200 OK` – successful GET, PUT, DELETE
- `201 Created` – successful POST
- `400 Bad Request` – missing or invalid fields
- `404 Not Found` – opportunity ID does not exist
- `500 Internal Server Error` – unexpected server error

## Postman Testing

Import `postman_collection.json` into Postman (or Bruno). It includes requests for:

1. Creating three research opportunities
2. Retrieving all opportunities
3. Retrieving one opportunity by ID
4. Updating an opportunity
5. Changing an opportunity's status from Open to Closed
6. Deleting an opportunity
7. Requesting the deleted opportunity again (returns 404 Not Found)
8. Sending invalid or missing data (returns 400 Bad Request)

**Before running requests 5 to 9:** run requests 1 to 3 first, copy an `id` from one of the responses, and paste it into the `opportunityId` collection variable (click the collection name, open the **Variables** tab, set **Current value**, and save).

## Notes

- No data is hard-coded in the frontend. Everything is fetched from the backend API.
- All CRUD operations use the MySQL database.
- `.env` is excluded from the repository. Use `.env.example` as a template. No credentials are committed.