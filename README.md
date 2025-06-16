# 🎯 [Hangman Game – MERN-Stack Web App](https://hangman-0ci9.onrender.com/)

An interactive, full-stack implementation of the classic **Hangman** game built using **Node.js**, **Express**, and **MongoDB** on the backend, designed to deliver a smooth and engaging word-guessing experience via REST APIs.

This project goes beyond the basic game logic—it's structured like a real-world multiplayer game server, featuring **robust session management**, **attempt tracking**, **letter and word validation**, and a **high-score system**, all while maintaining scalability and clean code architecture.

---

## 🚀 Key Features

- 🔤 **Smart Guess Handling**: Users can guess individual letters or full words, with efficient logic to handle repeated guesses, case insensitivity, and input validation.
- 🧠 **Dynamic Game State Management**: All game states (e.g., guessed letters, remaining attempts, hidden word format) are persistently managed using MongoDB for session continuity.
- 📉 **Attempt Reduction & Game Over Logic**: Includes precise logic to deduct attempts and gracefully end the game when conditions are met.
- 🏆 **High Score Tracking**: Automatically stores and checks for new high scores when a player wins, ideal for adding competitive gameplay or a leaderboard system.
- 📡 **REST API Design**: Well-defined API routes to create a game, submit guesses (letter/word), and manage game progression—can be easily connected to any frontend or mobile client.
- 🛡️ **Error-Handled and Tested**: Includes comprehensive input validation, response standardization, and error handling to ensure a consistent developer and user experience.

---

## 📏 GAME RULES & TIPS

- ✅ **One Letter at a Time**: You can guess one letter at a time. Case is ignored (`A` and `a` are treated the same).
- 🔄 **Repeated Guesses Are Tracked**: The system tracks previously guessed letters to prevent unfair penalties.
- 💡 **Guessing the Whole Word**: At any point, you can attempt to guess the full word. But beware—wrong guesses count as failed attempts!
- ❤️ **Limited Attempts**: Each wrong guess reduces the number of remaining attempts. Use them wisely. You have a total of 6 attempts. (Depicting 6 parts: Head, 2 Arms, 2 Legs and Body)
- 🧠 **Strategize**: Start with common vowels and consonants to maximize your chances early on.
- 📈 **Aim for High Score**: If you guess the word correctly with fewer attempts, you may set a new high score!

---

## 🛠️ Tech Stack

- **Frontend**: React.js (React + Vite) 
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (with Mongoose)  
- **Others**: REST APIs, Postman-tested endpoints  
---

## Setup Instructions

1. Clone the repo
2. Install dependencies:
   - `cd backend && npm install`
   - `cd frontend && npm install`
3. Setup Environment Variables:
   - In the `backend/` folder, copy `.env.example` to `.env` and fill in your actual values:
     ```bash
     cp .env.example .env
     ```
   - Do the same in the `frontend/` folder:
     ```bash
     cp .env.example .env
     ```

Start the project:
```bash
# In backend
npm run server

# In frontend
npm run dev
```
---

> 🎯 Built to simulate real-world API-driven game logic with scalability, testability, and clean architecture in mind.

---
