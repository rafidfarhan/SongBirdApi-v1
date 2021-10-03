const Album = require("../models/albumModel");
const Track = require("../models/trackModel");
const Playlist = require("../models/playlistModel");
const Artist = require("../models/artistModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.searchAlbums = asyncHandler(async (req,res,next) =>{

    if(req.query.search){
        res.status(200).json(res.searchResults);
    }
    else{
        res.status(200).json({success: true,count: 0, pagination: {}, data:[]});
    }
   
    
});

exports.searchTracks = asyncHandler(async (req,res,next) =>{

    if(req.query.search){
        res.status(200).json(res.searchResults);
    }
    
    else{
        res.status(200).json({success: true,count: 0, pagination: {}, data:[]});
    }
    
});

exports.searchPlaylists = asyncHandler(async (req,res,next) =>{
    
    if(req.query.search){
        res.status(200).json(res.searchResults);
    }
    
    else{
        res.status(200).json({success: true,count: 0, pagination: {}, data:[]});
    }
    
});

exports.searchArtists = asyncHandler(async (req,res,next) =>{
    if(req.query.search){
        res.status(200).json(res.searchResults);
    }
    
    else{
        res.status(200).json({success: true,count: 0, pagination: {}, data:[]});
    }
    
    // let searchTerm = req.query.search;
    // let artists = [];
    // if(req.query.search){
    //     let spacedSearchTerm=searchTerm.split('%').join(' ');
    //     artists = await Artist.find({name: {$regex : spacedSearchTerm, $options:'$i'}}).populate('albums');
    // }
    
    // res.status(200).json({success: true,count: artists.length,data: artists});
    
});