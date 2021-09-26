const Track = require("../models/trackModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.createTrack = asyncHandler(async (req,res,next) =>{
   
        const track = await Track.create(req.body);
        res.status(201).json({
            success: true,
            message: "track created",
            data: track
        });

});

exports.getTrack = asyncHandler(async (req,res,next) =>{
    
        const track = await Track.findById(req.params.id).populate('album');
        if (!track){
            next(new ErrorResponse (`Track with id of ${req.params.id} not found`,404));
        }
        else{
            res.status(200).json({success: true,data: track});
        }
});

exports.getTracks = asyncHandler(async (req,res,next) =>{
    let query;

    if(req.params.albumId){
        query = Track.find({album: req.params.albumId}).populate('album');
    }
    else{
        query = Track.find().populate('album');
    }
    
        const tracks = await query;
        res.status(200).json({success: true,count : tracks.length ,data: tracks});
});


exports.updateTrack = asyncHandler(async (req,res,next) =>{
  
        const track = await Track.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        });

        if (!track){
            next(new ErrorResponse (`Track with id of ${req.params.id} not found`,404));
        }
        else{
            res.status(200).json({success: true,data: track});
        }  
    
});

exports.deleteTrack = asyncHandler(async (req,res,next) =>{
    
        const track = await Track.findByIdAndDelete(req.params.id);
        
        if (!track){
            next(new ErrorResponse (`Track with id of ${req.params.id} not found`,404));
        }
        else{
            res.status(200).json({success: true,data: {}});

        }      
    
});