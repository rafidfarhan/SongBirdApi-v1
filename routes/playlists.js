const express = require("express");
const {
    createPlaylist,
    getPlaylist,
    getPlaylists, 
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongToPlaylist,
    savePlaylist,
    removeSavedPlaylist,
    getSavedPlaylists,
    getCreatedPlaylists

} = require("../controllers/playlists");
const {protect} = require("../middleware/auth");

const router = express.Router();

router.post('/',protect,createPlaylist);
router.route('/').get(getPlaylists);
router.get('/savedplaylists', protect,getSavedPlaylists);
router.get('/myplaylists', protect,getCreatedPlaylists);

router.route('/:id').get(getPlaylist);
router.put('/:id', protect,updatePlaylist);
router.put('/addtoplaylist/:id', protect,addSongToPlaylist);
router.put('/removefromplaylist/:id', protect,removeSongToPlaylist);

router.put('/saveplaylist/:id', protect,savePlaylist);
router.put('/removeplaylistfromlibrary/:id', protect,removeSavedPlaylist);

router.delete('/:id',protect, deletePlaylist);

module.exports = router; 