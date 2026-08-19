# 🎯 [Hangman Ecosystem – MERN-Stack Gaming Platform](https://hangman-c0h7.onrender.com)

An interactive, full-stack implementation of the classic **Hangman** game built using **Node.js**, **Express** and **MongoDB**. This project has evolved into a comprehensive gaming ecosystem featuring a **Player App**, a dedicated **Admin Panel**, a **Community Contribution System**, and a fully automated **CI/CD DevOps Pipeline**.

This project goes beyond the basic game logic. It mimics a real-world production application with **robust session management**, **transactional emails (Brevo)**, **role-based access control**, **attempt tracking**, **letter and word validation**, a **high-score system**, a **responsive UI** with custom animations, and **automated cloud deployments**.

---

## 🚀 Key Features

### ⚙️ CI/CD & DevOps Pipeline (New Update: Aug 2026)
* 🐳 **Containerized Architecture**: The Express backend is fully containerized using a lightweight, highly optimized `node:20-alpine` Docker image.
* 🏗️ **Automated Jenkins Pipeline**: A robust Continuous Integration and Continuous Deployment (CI/CD) pipeline triggered on GitHub pushes. It automatically installs dependencies, runs smoke tests, builds the Docker image, and pushes it to Docker Hub.
* ☁️ **Cloud Deployment (GCP)**: Automated, zero-downtime deployments via SSH to a live Google Cloud Platform (GCP) Compute Engine instance, orchestrated by `docker-compose`.
* 🤖 **Custom Build Agent**: Utilizes a custom-built Jenkins Node.js agent with integrated Docker socket access for secure and isolated pipeline executions.

### 🎮 Gameplay & Core Logic
* 🔤 **Smart Guess Handling**: Efficient logic for individual letters or full word guesses, handling case insensitivity and repeated inputs.
* 🧠 **Dynamic Game State**: Persistent game sessions using MongoDB (guessed letters, remaining attempts, formatted hidden words).
* 📉 **Attempt Reduction & Game Over Logic**: Includes precise logic to deduct attempts and gracefully end the game when conditions are met.
* 🏆 **High Score System**: Automatic tracking of player records and leaderboards, ideal for adding competitive gameplay.
* 📉 **Visual Health Tracking**: Classic 6-step Hangman progression (Head → Body → Limbs).
* 📡 **REST API Design**: Well-defined API routes to create a game, submit guesses (letter/word) and manage game progression, easily connected to any frontend or mobile client.
* 🛡️ **Error-Handling**: Includes comprehensive input validation, response standardization and error handling to ensure a consistent user experience.

### 🤝 Contribution Ecosystem
* 📝 **Community Suggestions**: Players can submit new **Words** or **Genres** via a dedicated form (powered by `React Hook Form` with strict validation).
* 🚦 **Approval Workflow**: Submissions enter a "PENDING" queue for Admin review.
* 🔔 **Real-Time Notifications**: Players receive in-app notification badges and updates when their requests are processed.
* 📧 **Smart Notifications**: Automated email alerts via **Brevo (formerly Sendinblue)**. Admins are instantly notified of new contributions, while Players receive real-time status updates (Approved/Denied) after verifying their email via OTP.

### 🛡️ Admin Panel
* 💻 **Dedicated Dashboard**: A separate React application for administrators to manage game content.
* 🔍 **Review System**: Admins can Approve or Deny contributions with optional feedback comments.
* 📊 **History & Filtering**: Filter requests by status (Pending, Approved, Denied) or type (Word/Genre).

### 🎨 Enhanced UI/UX
* ⏳ **Custom Loader**: Stylish, physics-based "Swinging Hangman" loader with artificial delay handling for smooth transitions.
* ✨ **Interactive Feedback**: Shake animations on errors, toast notifications for actions and uppercase-enforced inputs.
* 📱 **Fully Responsive**: Optimized layouts for Mobile and Desktop across both Player and Admin apps.

---

## 📏 GAME RULES & TIPS

* ✅ **One Letter at a Time**: You can guess one letter at a time. Case is ignored (`A` and `a` are treated the same).
* 💡 **Guessing the Whole Word**: At any point, you can attempt to guess the full word. But beware—wrong guesses count as failed attempts!
* 🔄 **Repeated Guesses Are Tracked**: The system tracks previously guessed letters and words to prevent unfair penalties.
* ❤️ **Limited Attempts**: Each wrong guess reduces the number of remaining attempts. Use them wisely. You have a total of 6 attempts. (Depicting 6 parts: Head, 2 Arms, 2 Legs and Body)
* 🧠 **Strategize**: Start with common vowels and consonants to maximize your chances early on.
* 📈 **Aim for High Score**: If you guess the word correctly with fewer attempts, you may set a new high score!

---

## 🛠️ Tech Stack

### **Frontend (Client / Player App)**
* **Framework**: React.js (Vite)
* **Styling**: CSS3 (Custom animations, Backdrop filters), React Icons
* **Core**: React 19, Vite
* **Routing**: React Router DOM (v7)
* **State/Forms**: React Hook Form, Context API
* **UI & Effects**: React Hot Toast, React Confetti, Use Sound, React Icons
* **HTTP**: Axios (with Interceptors)

### **Frontend (Admin Panel)**
* **Core**: React 19, Vite
* **Styling**: Tailwind CSS (v4)
* **Routing**: React Router DOM (v7)
* **Forms**: React Hook Form
* **UI Components**: React Hot Toast, React Icons
* **HTTP**: Axios

### **Backend & Database**
* **Runtime**: Node.js, Express.js
* **Database**: MongoDB (Mongoose ODM) with Compound Indexes
* **Email Service**: Brevo (`@getbrevo/brevo`) API
* **Authentication & Security**: JWT (JsonWebToken), Bcrypt, Cookie-Parser, Helmet, CORS
* **Utilities**: Random Words, Dotenv

### **DevOps & Deployment**
* **CI/CD Pipeline**: Jenkins (Custom Node.js Docker Agent)
* **Containerization**: Docker, Docker Compose, Docker Hub
* **Cloud Hosting**: Google Cloud Platform (GCP) Compute Engine (Ubuntu Linux)
* **Frontend Hosting**: Render.com

---

## Setup Instructions

### Local Development Setup

1. **Clone the repo**
```bash
git clone https://github.com/Max-31/Hangman.git

```

2. **Install dependencies**

```bash
cd server && npm install
cd ../client && npm install
cd ../admin && npm install

```

3. **Setup Environment Variables**

**Backend (`server/.env`):**

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
# Brevo Email Config
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=no-reply@yourdomain.com
ADMIN_EMAIL=your_email@example.com
ADMIN_URL=http://localhost:5174

```

**Frontend Client (`client/.env`):**

```env
VITE_API_URL=http://localhost:5000

```

**Frontend Admin (`admin/.env`):**

```env
VITE_API_URL=http://localhost:8000

```

4. **Start the project locally**

```bash
# Run Backend
cd server
npm run server

# Run Player App
cd client
npm run dev

# Run Admin Panel
cd admin
npm run dev

```

### Docker Setup (Backend)

To run the backend environment using Docker:

```bash
cd server
docker-compose up -d

```

---

🎯 **Architecture Note:**

* The backend uses a **Compound Index** `{ word: 1, genre: 1 }` to allow the **same word to exist across different genres** (e.g., *"Jaguar"* in *Animals* and *"Jaguar"* in *Cars*), while preventing duplicates within the same genre.
