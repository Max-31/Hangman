const router= require('express').Router();
const {login, signUp, logout}= require('../controllers/auth.controller');

router.post('/login', login);
router.post('/signUp', signUp);
router.post('/logout', logout);

module.exports= router;