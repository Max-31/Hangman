const router= require('express').Router();
const {login, signUp, logout, forgotPassword, resetPassword}= require('../controllers/auth.controller');

router.post('/login', login);
router.post('/signUp', signUp);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports= router;