const express = require("express");
const {getAlbum,getAlbums, createAlbum,updateAlbum,deleteAlbum} = require("../controllers/albums");
//Other resource router
const trackRouter = require("./tracks")

const router = express.Router();

router.use('/:albumId/songs',trackRouter);

router.route('/').post(createAlbum);
router.route('/').get(getAlbums);

router.route('/:id').get(getAlbum);
router.route('/:id').put(updateAlbum);
router.route('/:id').delete(deleteAlbum);

module.exports = router; 