# Backend API

## Run
1. Copy `.env.example` to `.env`
2. Import [`schema.sql`](backend/sql/schema.sql)
3. Install deps: `npm install`
4. Start dev server: `npm run dev`

## Endpoints
- `GET /health`
- `GET /api/students?search=andi`
- `GET /api/students/:id`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

## Sample body
```json
{
  "nim": "2201004",
  "name": "Dewi Anggraini",
  "studyProgram": "Informatika",
  "semester": 5,
  "gpa": 3.45
}
```
