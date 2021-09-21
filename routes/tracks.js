const express = require("express");
const {getTrack,getTracks, createTrack,updateTrack,deleteTrack} = require("../controllers/tracks");

const router = express.Router();

router.route('/').post(createTrack);
router.route('/').get(getTracks);

router.route('/:id').get(getTrack);
router.route('/:id').put(updateTrack);
router.route('/:id').delete(deleteTrack);

module.exports = router; 