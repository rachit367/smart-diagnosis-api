## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (via Mongoose)
- **AI Provider:** OpenRouter API (free model)
- **AI Model:** `nvidia/nemotron-3-super-120b-a12b:free`

---

## How AI Is Integrated

The core of this project is an AI-powered diagnosis engine inside `services/diagnosisService.js`.

**How it works:**

1. User sends their symptoms via the API.
2. The symptoms are injected into a carefully crafted prompt.
3. The prompt is sent to the **OpenRouter API** (using the free `nvidia/nemotron-3-super-120b` model) through the OpenAI SDK.
4. The AI model responds with 2-3 possible medical conditions in JSON format, each with a probability and recommended next steps.
5. The response is parsed, saved to MongoDB, and returned to the user.

**About the prompt:**

The AI prompt was written and refined with the help of **ChatGPT**. It instructs the model to act as an experienced medical doctor and clinical diagnostician, providing professional-grade differential diagnoses with proper medical terminology, specific diagnostic tests, and specialist referrals.

**Why OpenRouter?**

We used [OpenRouter](https://openrouter.ai/) because it provides access to powerful AI models for **free** — no paid API key needed to get started.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- An [OpenRouter](https://openrouter.ai/) API key (free)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/smart-diagnosis-API.git
cd smart-diagnosis-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
OPENROUTER_KEY=your_openrouter_api_key
OPENROUTER_MODEL=nvidia/nemotron-3-super-120b-a12b:free
```

### 4. Start the server

```bash
node server.js
```

You should see:

```
MongoDB connected
server started
```

The API will be running at `http://localhost:3000`

---

## API Endpoints

### 1. `POST /api/diagnose` — Get AI Diagnosis

Send symptoms and receive possible medical conditions.

**Request:**

```bash
POST http://localhost:3000/api/diagnose
Content-Type: application/json

{
  "symptoms": "severe headache, blurred vision, nausea"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "symptoms": "severe headache, blurred vision, nausea",
    "conditions": [
      {
        "condition": "Migraine with Aura",
        "probability": "75%",
        "next_steps": [
          "Order a CT scan of the head",
          "Refer to a Neurologist for further evaluation"
        ]
      },
      {
        "condition": "Hypertensive Crisis",
        "probability": "60%",
        "next_steps": [
          "Check blood pressure immediately",
          "Order a basic metabolic panel (BMP)",
          "Refer to a Cardiologist"
        ]
      }
    ],
    "createdAt": "2026-03-31T10:00:00.000Z"
  }
}
```

**Error (missing symptoms):**

```json
{
  "success": false,
  "message": "symptoms field is required"
}
```

---

### 2. `GET /api/history` — Get Diagnosis History

Retrieve all past diagnoses, sorted by newest first.

**Request:**

```bash
GET http://localhost:3000/api/history
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "symptoms": "severe headache, blurred vision, nausea",
      "conditions": [ ... ],
      "createdAt": "2026-03-31T10:00:00.000Z"
    },
    {
      "_id": "...",
      "symptoms": "chest pain, shortness of breath",
      "conditions": [ ... ],
      "createdAt": "2026-03-30T08:30:00.000Z"
    }
  ]
}
```

---

## Project Structure

```
smart-diagnosis-API/
├── server.js                  # Entry point — starts the server
├── app.js                     # Express app setup, middleware, routes
├── .env                       # Environment variables (not in git)
├── package.json               # Dependencies
│
├── config/
│   └── db.js                  # MongoDB connection logic
│
├── routes/
│   └── diagnosisRouter.js     # API route definitions
│
├── controllers/
│   └── diagnosisController.js # Request handling & validation
│
├── services/
│   └── diagnosisService.js    # AI prompt + business logic
│
├── models/
│   ├── Diagnosis.js           # Diagnosis schema (symptoms + condition refs)
│   └── Condition.js           # Condition schema (name, probability, next steps)
│
└── middlewares/
    └── errorHandling.js       # Global error handler
```

---

## Credits

- AI prompt crafted with the help of **ChatGPT**
- AI responses powered by **OpenRouter** (free tier)
- AI model used: **nvidia/nemotron-3-super-120b-a12b:free**
