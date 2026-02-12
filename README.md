# 🎯 [Hangman Ecosystem – MERN-Stack Gaming Platform](https://hangman-c0h7.onrender.com)

An interactive, full-stack implementation of the classic **Hangman** game built using **Node.js**, **Express** and **MongoDB**. This project has evolved into a comprehensive gaming ecosystem featuring a **Player App**, a dedicated **Admin Panel** and a **Community Contribution System**.

This project goes beyond the basic game logic. It mimics a real-world production application with **robust session management**, **transactional emails (Brevo)**, **role-based access control**, **attempt tracking**, **letter and word validation**, a **high-score system** and a **responsive UI** with custom animations.

---

## 🚀 Key Features

### 🎮 Gameplay & Core Logic

* 🔤 **Smart Guess Handling**: Efficient logic for individual letters or full word guesses, handling case insensitivity and repeated inputs.
* 🧠 **Dynamic Game State**: Persistent game sessions using MongoDB (guessed letters, remaining attempts, formatted hidden words).
* 📉 **Attempt Reduction & Game Over Logic**: Includes precise logic to deduct attempts and gracefully end the game when conditions are met.
* 🏆 **High Score System**: Automatic tracking of player records and leaderboards, ideal for adding competitive gameplay
* 📉 **Visual Health Tracking**: Classic 6-step Hangman progression (Head → Body → Limbs).
* 📡 **REST API Design**: Well-defined API routes to create a game, submit guesses (letter/word) and manage game progression, easily connected to any frontend or mobile client.
* 🛡️ **Error-Handling**: Includes comprehensive input validation, response standardization and error handling to ensure a consistent user experience.


### 🤝 Contribution Ecosystem (New)

* 📝 **Community Suggestions**: Players can submit new **Words** or **Genres** via a dedicated form (powered by `React Hook Form` with strict validation).
* 🚦 **Approval Workflow**: Submissions enter a "PENDING" queue for Admin review.
* 🔔 **Real-Time Notifications**: Players receive in-app notification badges and updates when their requests are processed.
* 📧 **Transactional Emails**: Automated email notifications will be sent to Admin(s) via **Brevo (formerly Sendinblue)** when the Players will add new contribution.

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
* **Notifications**: React Hot Toast

### **Frontend (Admin Panel)**

* **Core**: React 19, Vite
* **Styling**: Tailwind CSS (v4)
* **Routing**: React Router DOM (v7)
* **Forms**: React Hook Form
* **UI Components**: React Hot Toast, React Icons
* **HTTP**: Axios

### **Backend**

* **Runtime**: Node.js, Express.js
* **Database**: MongoDB (Mongoose ODM) with Compound Indexes
* **Email Service**: Brevo (`@getbrevo/brevo`) API
* **Authentication & Security**: JWT (JsonWebToken), CORS Configuration, Bcrypt, Cookie-Parser, Helmet, CORS
* **Utilities**: Random Words, Dotenv

### **Deployment**

* **Platform**: Render.com
* **Structure**: Separately deployed Micro-services (Client Static Site, Admin Static Site, Backend Web Service).

---

## Setup Instructions

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
**Backend (`server/.env.example`):**
```env
PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
# Brevo Email Config
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=no-reply@yourdomain.com
ADMIN_EMAIL=your_email@example.com
ADMIN_URL=https://your-admin-app.onrender.com

```

**Frontend Client (`client/.env.example`):**
```env
VITE_API_URL=https://your-backend-api.onrender.com

```


**Frontend Admin (`admin/.env.example`):**
```env
VITE_API_URL=https://your-backend-api.onrender.com

```


4. **Start the project**
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


---

🎯 **Architecture Note:** 
- The backend uses a **Compound Index** `{ word: 1, genre: 1 }` to allow the **same word to exist across different genres** (e.g., _"Jaguar"_ in *Animals* and _"Jaguar"_ in *Cars*), while preventing duplicates within the same genre.
