const express = require('express');
const router = express.Router();
const googleCtrl = require('../controllers/google');

router.get('/search/:term/:location', googleCtrl.search)
router.get('/details/:id', googleCtrl.getRestaurantDetails)

module.exports = router;