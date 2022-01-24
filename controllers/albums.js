const Album = require("../models/albumModel");
const Artist = require("../models/artistModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.createAlbum = asyncHandler(async (req,res,next) =>{
   
        const album = await Album.create(req.body);
        res.status(201).json({
            success: true,
            message: "Album created",
            data: album
        });

});

exports.getAlbum = asyncHandler(async (req,res,next) =>{
    
        const album = await Album.findById(req.params.id).populate([{
            path: 'tracks',
            select : 'title streamUrl duration albumName artistName slug'
        },
        {
            path: 'artists',
            select : 'name coverUrl profileImgUrl slug'
        }
    ]);
        if (!album){
            next(new ErrorResponse (`Album with id of ${req.params.id} not found`,404));
        }
        else{
            res.status(200).json({success: true,data: album});
        }
});

exports.getAlbums = asyncHandler(async (req,res,next) =>{

        res.status(200).json(res.advancedResults);
});

exports.getTimelineAlbums = asyncHandler(async (req,res,next) =>{
    const user = req.user;
    const artists = user.following;
    let albums = [];

    for (let i = 0; i < artists.length; i++) {
        const artist = await Artist.findById(artists[i]).populate('albums');
        const albumsOfArtist = artist.albums;
        albums.push(albumsOfArtist);
      }

    res.status(200).json({success: true,count : albums.length, data: albums});
});


exports.updateAlbum = asyncHandler(async (req,res,next) =>{
  
        const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        });

        if (!album){
            next(new ErrorResponse (`Album with id of ${req.params.id} not found`,404));
        }
        else{
            res.status(200).json({success: true,data: album});
        }  
    
});

exports.deleteAlbum = asyncHandler(async (req,res,next) =>{
    
        const album = await Album.findById(req.params.id);
        
        if (!album){
            next(new ErrorResponse (`Album with id of ${req.params.id} not found`,404));
        }

        else{
            album.remove();
            res.status(200).json({success: true,data: {}});

        }      
    
});

exports.saveAlbum = asyncHandler(async (req,res,next) =>{
    
    const album = await Album.findById(req.params.id);
    const user = req.user;
    
    if (!album){
        next(new ErrorResponse (`Album with id of ${req.params.id} not found`,404));
    }
    else{
        if (!user.savedAlbums.includes(album.id)) {
            await user.updateOne({ $push: { savedAlbums: req.params.id } });
            res.status(200).json({success: true,message: 'Album saved'});
          } else {
            res.status(403).json({success: false,message:"Album already saved by user"});
          }
       
    }      

});

exports.removeSavedAlbum = asyncHandler(async (req,res,next) =>{
    
    const album = await Album.findById(req.params.id);
    const user = req.user;
    
    if (!album){
        next(new ErrorResponse (`Album with id of ${req.params.id} not found`,404));
    }
    else{
        if (user.savedAlbums.includes(album.id)) {
            await user.updateOne({ $pull: { savedAlbums: req.params.id } });
            res.status(200).json({success: true,message: 'Album removed from collection'});
          } else {
            res.status(403).json({success: false,message:"Album was not saved by user"});
          }
       
       

    }      

});

exports.getSavedAlbums= asyncHandler(async (req,res,next) =>{
    
    const user = req.user;
    const albums = await Promise.all(
        user.savedAlbums.map((albumId) => {
          return Album.findById(albumId).populate([{
            path: 'tracks',
            select : 'title streamUrl duration slug'
        },
        {
            path: 'artists',
            select : 'name coverUrl profileImgUrl slug'
        }
    ]);
        })
      );
    

    res.status(200).json({success: true, data: albums});
    
});


