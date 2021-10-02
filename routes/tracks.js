const express = require("express");
const {
    getTrack,
    getTracks,
    createTrack,
    updateTrack,
    deleteTrack,
    likeTrack,
    removeLikedTrack,
    getLikedTracks
    } = require("../controllers/tracks");

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const Track = require('../models/trackModel');

const router = express.Router({mergeParams: true});

router.use(protect);
router.route('/').get(advancedResults(Track),getTracks);
router.route('/likedsongs').get(getLikedTracks);
router.route('/:id').get(getTrack);
router.route('/liketrack/:id').put(likeTrack);
router.route('/removelikefromtrack/:id').put(removeLikedTrack);


router.use(authorize('admin'));

router.route('/').post(createTrack);
router.route('/:id').put(updateTrack);
router.route('/:id').delete(deleteTrack);

module.exports = router; 