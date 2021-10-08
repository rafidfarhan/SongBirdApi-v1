const express = require("express");
const advancedResults = require('../middleware/advancedResults');
const Playlist = require('../models/playlistModel');
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
    getCreatedPlaylists,
    playlistImageUpload,
    getFeaturedPlaylists
   

} = require("../controllers/playlists");
const {protect} = require("../middleware/auth");

const router = express.Router();

router.post('/',protect,createPlaylist);

router.route('/').get(advancedResults(Playlist,[{
    path: 'tracks',
    select : 'title streamUrl duration slug'
},
{
    path: 'owner',
    select : 'username'
}
]),getPlaylists);

router.get('/savedplaylists', protect,getSavedPlaylists);

router.get('/featured', protect,getFeaturedPlaylists);
router.get('/myplaylists', protect,getCreatedPlaylists);


router.route('/:id').get(getPlaylist);
router.put('/:id', protect,updatePlaylist);
router.put('/addtoplaylist/:id', protect,addSongToPlaylist);
router.put('/removefromplaylist/:id', protect,removeSongToPlaylist);

router.put('/saveplaylist/:id', protect,savePlaylist);
router.put('/removeplaylistfromlibrary/:id', protect,removeSavedPlaylist);
router.put('/uploadplaylistimage/:id', protect,playlistImageUpload);

router.delete('/:id',protect, deletePlaylist);

module.exports = router; 