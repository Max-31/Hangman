const express= require('express');
const router= express.Router();

const {
    addRequest,
    getMyRequests,
    getGenres, 
    getAllRequests,
    reviewRequest,
    getNotificationCount,
    markAsRead
}= require('../controllers/contribution.controller');

const {protectRoute} = require('../middleware/protectRoute');
const {verifyAdmin} = require('../middleware/verifyAdmin');

// user
router.post('/add', protectRoute, addRequest);
router.get('/my-requests/:userID', protectRoute, getMyRequests);
router.get('/genres', protectRoute, getGenres);
router.get('/notifications/:userID', protectRoute, getNotificationCount);
router.put('/notifications/clear', protectRoute, markAsRead);

//admin
router.get('/admin/all', protectRoute, verifyAdmin, getAllRequests);
router.put('/admin/review', protectRoute, verifyAdmin, reviewRequest);

// /contribution/add
// /contribution/my-requests/:userID
// /contribution/genre
// /contribution/admin/all
// /contribution/admin/review

module.exports = router;