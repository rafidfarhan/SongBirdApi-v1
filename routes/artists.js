const express = require("express");
const {getArtist,getArtists, createArtist,updateArtist,deleteArtist,followArtist,unfollowArtist } = require("../controllers/artists");

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const Artist = require('../models/artistModel');

const router = express.Router();

router.use(protect);

router.route('/').get(advancedResults(Artist,[{
    path: 'albums',
    select : 'title albumType artists genre albumUrl releaseDate slug'
}
]),getArtists);
router.route('/:id').get(getArtist);
router.route('/:id/follow').put(followArtist);
router.route('/:id/unfollow').put(unfollowArtist);

router.use(authorize('admin'));

router.route('/').post(createArtist);
router.route('/:id').put(updateArtist);
router.route('/:id').delete(deleteArtist);

module.exports = router; 