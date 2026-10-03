# University Research Opportunity Portal

A full-stack web application that lets faculty members post, view, update, and manage research opportunities in one place, replacing scattered emails, WhatsApp groups, and noticeboards.

**GitHub Repository:** **GitHub Repository:** https://github.com/Ramsha-5995/research-opportunity-portal
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
│   │   └── opportunities.js   # All CRUD route handlers
│   ├── db.js                  # MySQL connection pool
│   ├── server.js              # Express app entry point
│   ├── schema.sql             # Database schema + sample data
│   ├── package.json
│   └── .env.example           # Copy to .env and fill in your DB credentials
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── postman_collection.json    # Exported Postman collection
└── README.md
```

## Setup Instructions

### 1. Set up the database

Make sure MySQL is installed and running, then run:

```bash
mysql -u root -p < backend/schema.sql
```

This creates the `research_portal` database, the `opportunities` table, and inserts two sample rows.

### 2. Configure and run the backend

```bash
cd backend
cp .env.example .env
# Edit .env and set your MySQL username/password
npm install
npm start
```

The API will start on `http://localhost:5000`.

### 3. Run the frontend

The frontend is plain HTML/CSS/JS, so you can open it directly or serve it with a simple static server:

```bash
cd frontend
# Option A: just open index.html in your browser
# Option B: serve it (recommended, avoids CORS/file:// issues)
npx serve .
```

Make sure the backend is running first, since the frontend calls `http://localhost:5000/api/opportunities`.

## API Endpoints

| Method | Endpoint                  | Description                          |
|--------|----------------------------|---------------------------------------|
| POST   | `/api/opportunities`       | Create a new research opportunity     |
| GET    | `/api/opportunities`       | Retrieve all research opportunities   |
| GET    | `/api/opportunities/:id`   | Retrieve one opportunity by ID        |
| PUT    | `/api/opportunities/:id`   | Update an opportunity (partial updates supported) |
| DELETE | `/api/opportunities/:id`   | Delete an opportunity                 |

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

### Status Codes Used

- `200 OK` – successful GET, PUT, DELETE
- `201 Created` – successful POST
- `400 Bad Request` – missing/invalid fields
- `404 Not Found` – opportunity ID does not exist
- `500 Internal Server Error` – unexpected server error

## Postman Testing

Import `postman_collection.json` into Postman (or Bruno). It includes requests to:

1. Create three research opportunities
2. Retrieve all opportunities
3. Retrieve one opportunity by ID
4. Update an opportunity
5. Change status from Open to Closed
6. Delete an opportunity
7. Re-request the deleted opportunity (demonstrates 404)
8. Submit invalid/missing data (demonstrates 400 validation)

After running requests #1–3, copy an `id` from the response into the `opportunityId` collection variable to use in the later requests.

## Notes

- No data is hard-coded in the frontend — everything is fetched from the backend API.
- Basic form validation is done both on the frontend (required fields) and backend (field presence, data types, valid status values).
- `.env` is excluded from the repository; use `.env.example` as a template. No credentials are committed.
