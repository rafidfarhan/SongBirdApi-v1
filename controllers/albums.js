const Album = require("../models/albumModel");
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
            select : 'title streamUrl duration slug'
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
    
        const albums = await Album.find().populate([{
            path: 'tracks',
            select : 'title streamUrl duration slug'
        },
        {
            path: 'artists',
            select : 'name coverUrl profileImgUrl slug'
        }
    ]);
        res.status(200).json({success: true,count : albums.length ,data: albums});
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