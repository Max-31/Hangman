const router= require('express').Router();
const {newGame, continueGame, profile, processGuess, leaderboard, endGame, isSession}= require('../controllers/play.controller');
const { protectRoute } = require('../middleware/protectRoute');

router.post('/newGame', protectRoute, newGame);
router.post('/continue', protectRoute, continueGame);
router.put('/guess', protectRoute, processGuess);
router.get('/session/:userID', protectRoute, isSession);
router.get('/profile/:userID', protectRoute, profile);
router.get('/leaderboard', leaderboard);
router.delete('/endGame', protectRoute, endGame);

module.exports= router;