const express = require("express");
const {
    searchAlbums,
    searchTracks,
    searchPlaylists,
    searchArtists
} = require("../controllers/search");
const searchResults = require("../middleware/searchResults");
const Album = require("../models/albumModel");
const Track = require("../models/trackModel");
const Playlist = require("../models/playlistModel");
const Artist = require("../models/artistModel");
const {protect} = require("../middleware/auth");

const router = express.Router();

router.use(protect);
// router.post('/register', register);
// router.post('/login', login);
// router.get('/logout', logout);
router.route('/albums').get(searchResults(Album,[{
    path: 'tracks',
    select : 'title streamUrl duration slug'
},
{
    path: 'artists',
    select : 'name coverUrl profileImgUrl slug'
}
],'title'),searchAlbums);

router.route('/tracks').get(searchResults(Track,'album'),searchTracks);

router.route('/playlists').get(searchResults(Playlist,[{
    path: 'tracks',
    select : 'title streamUrl duration slug'
},
{
    path: 'owner',
    select : 'username'
}
],'name'),searchPlaylists);

router.route('/artists').get(searchResults(Artist,'albums','name'),searchArtists);



// router.get('/playlists',protect, searchPlaylists);
// router.get('/artists',protect, searchArtists);

module.exports = router; 