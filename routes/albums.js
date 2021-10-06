const express = require("express");
const {getAlbum,
    getAlbums, 
    createAlbum,
    updateAlbum,
    deleteAlbum,
    saveAlbum,
    removeSavedAlbum,
    getSavedAlbums,
    getTimelineAlbums
} = require("../controllers/albums");

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const Artist = require('../models/artistModel');

const Album = require("../models/albumModel");
//Other resource router
const trackRouter = require("./tracks")

const router = express.Router();

router.use(protect);
router.use('/:albumId/songs',trackRouter);


router.route('/').get(advancedResults(Album,[{
    path: 'tracks',
    select : 'title streamUrl duration slug'
},
{
    path: 'artists',
    select : 'name coverUrl profileImgUrl slug'
}
]),getAlbums);

router.route('/savedalbums').get(getSavedAlbums);
router.route('/timeline').get(getTimelineAlbums);
router.route('/:id').get(getAlbum);


router.route('/savealbum/:id').put(saveAlbum);
router.route('/removesavedalbum/:id').put(removeSavedAlbum);

router.use(authorize('admin'));

router.route('/').post(createAlbum);
router.route('/:id').put(updateAlbum);
router.route('/:id').delete(deleteAlbum);

module.exports = router; 