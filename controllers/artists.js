const Artist = require("../models/artistModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.createArtist = asyncHandler(async (req,res,next) =>{
   
        const artist = await Artist.create(req.body);
        res.status(201).json({
            success: true,
            message: "Artist inserted into database",
            data: artist
        });

});

exports.getArtist = asyncHandler(async (req,res,next) =>{
    
        const artist = await Artist.findById(req.params.id).populate('albums');
        if (!artist){
            next(new ErrorResponse (`Artist with id of ${req.params.id} not found`,404));
        }
        else{
            res.status(200).json({success: true,data: artist});
        }
});

exports.getArtists = asyncHandler(async (req,res,next) =>{
    
    const artists = await Artist.find().populate('albums');
    res.status(200).json({success: true,count : artists.length ,data: artists});
});


exports.updateArtist = asyncHandler(async (req,res,next) =>{
  
        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        });

        if (!artist){
            next(new ErrorResponse (`Artist with id of ${req.params.id} not found`,404));
        }
        else{
            res.status(200).json({success: true,data: artist});
        }  
    
});

exports.deleteArtist = asyncHandler(async (req,res,next) =>{
    
        const artist = await Artist.findById(req.params.id);
        
        if (!artist){
            next(new ErrorResponse (`Artist with id of ${req.params.id} not found`,404));
        }
        else{
            artist.remove();
            res.status(200).json({success: true,data: {}});

        }      
    
});