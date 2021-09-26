const express = require("express");
const {getArtist,getArtists, createArtist,updateArtist,deleteArtist} = require("../controllers/artists");

const router = express.Router();

router.route('/').post(createArtist);
router.route('/').get(getArtists);

router.route('/:id').get(getArtist);
router.route('/:id').put(updateArtist);
router.route('/:id').delete(deleteArtist);

module.exports = router; 