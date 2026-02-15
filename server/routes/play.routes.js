const router= require('express').Router();
const { newGame, continueGame, profile, processGuess, leaderboard, endGame, isSession }= require('../controllers/play.controller');
const { protectRoute } = require('../middleware/protectRoute');
const { sendOTP, verifyOTP } = require('../controllers/emailAuth.controller');

router.post('/newGame', protectRoute, newGame);
router.post('/continue', protectRoute, continueGame);
router.put('/guess', protectRoute, processGuess);
router.get('/session/:userID', protectRoute, isSession);
router.get('/profile/:userID', protectRoute, profile);
router.get('/leaderboard', leaderboard);
router.delete('/endGame', protectRoute, endGame);
router.post('/send-otp', protectRoute, sendOTP)
router.post('/verify-otp', protectRoute, verifyOTP);

module.exports= router;