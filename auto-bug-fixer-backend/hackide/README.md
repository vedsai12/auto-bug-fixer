# 🚀 AUTO BUG FIXER — Backend

AI-powered backend service that analyzes source code, detects bugs, and returns optimized/refactored code using intelligent processing.

---

## 📌 Overview

The **Auto Bug Fixer Backend** is a Node.js-based service that:

* Accepts code files via API
* Analyzes code for bugs and issues
* Suggests improvements and fixes
* Generates refactored code
* Returns structured JSON responses for frontend integration

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **File Handling:** Multer
* **Environment Config:** dotenv
* **Code Diff Engine:** diff
* **Architecture:** MVC (Controllers, Services, Routes)

---

## 📂 Project Structure

```
AUTO_BUG_FIXER/
│
├── backend/
│   ├── controllers/
│   │   └── codeController.js
│   │
│   ├── routes/
│   │   └── codeRoutes.js
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   ├── bugService.js
│   │   └── refactorService.js
│   │
│   ├── utils/
│   │   ├── diffUtil.js
│   │   └── fileUtil.js
│   │
│   ├── uploads/
│   │
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── .gitignore
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/shimantranjan/AUTO_BUG_FIXER.git
cd AUTO_BUG_FIXER/backend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Start Server

```bash
npm start
```

Server will run on:

```
http://localhost:3000
```

---

## 🌐 API Endpoints

### 🔹 Health Check

```
GET /
```

Response:

```json
{
  "status": "Backend running 🚀",
  "endpoints": ["/api/analyze", "/health"]
}
```

---

### 🔹 Analyze Code (Main API)

```
POST /api/analyze
```

#### Request (form-data)

| Key  | Type | Description                |
| ---- | ---- | -------------------------- |
| file | File | Code file (.js, .py, etc.) |

---

#### Response (Success)

```json
{
  "success": true,
  "data": {
    "bugs": [
      {
        "line": 5,
        "issue": "Missing error handling",
        "severity": "high"
      }
    ],
    "explanation": "Code lacks proper validation and error handling.",
    "refactoredCode": "try { ... } catch(err) { ... }",
    "diff": []
  }
}
```

---

#### Response (Error)

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 🧠 Core Features

* 🔍 Static code analysis
* 🐞 Bug detection with severity levels
* ♻️ Automatic code refactoring
* 📊 Diff comparison between original and optimized code
* 📁 File upload & processing
* ⚡ Fast API response for real-time frontend integration

---

## 🔒 Environment Variables

Create a `.env` file inside `backend/`:

```
PORT=3000
IBM_API_KEY=your_api_key_here
IBM_API_URL=your_api_endpoint_here
```

---

## 🔄 Development Workflow

```bash
# Start development mode
npm run dev

# Commit changes
git add .
git commit -m "your message"
git push
```

---

## 🤝 Collaboration Guide

* Pull latest changes before working:

  ```bash
  git pull origin main
  ```

* Push after changes:

  ```bash
  git add .
  git commit -m "feature added"
  git push
  ```

---

## 🚀 Future Improvements

* 🔗 IBM AI API integration for advanced analysis
* 📜 Code history tracking
* 👤 User authentication system
* 📊 Dashboard for bug analytics
* ⚡ Performance optimization

---

## 📦 Deployment Ready

Backend is designed to be easily deployed on:

* Vercel (serverless adaptation)
* Render
* AWS / Azure
* Docker (optional future setup)

---

## 👨‍💻 Contributors

* **Shimant Ranjan** — Backend Developer
* **Dharun** — Backend Developer

---

## 📄 License

This project is built for hackathon and educational purposes.

---

## ⭐ Acknowledgment

Built as part of **IBM Bob Dev Day Hackathon** to demonstrate AI-driven code analysis and automation.

---
