const router= require('express').Router();
const {newGame, continueGame, profile, processGuess, leaderboard, endGame, isSession}= require('../controllers/play.controller');

router.post('/newGame', newGame);
router.post('/continue', continueGame);
router.put('/guess', processGuess);
router.get('/session/:userName', isSession);
router.get('/profile/:userName', profile);
router.get('/leaderboard', leaderboard);
router.delete('/endGame', endGame);
// router.put('/newHighScore', newHighScore);

module.exports= router;