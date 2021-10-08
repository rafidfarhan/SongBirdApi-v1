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
    
    // const artists = await Artist.find().populate('albums');
    // res.status(200).json({success: true,count : artists.length ,data: artists});
    res.status(200).json(res.advancedResults);
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

exports.followArtist = asyncHandler(async (req,res,next) =>{
    
    const artist = await Artist.findById(req.params.id);
    const user = req.user;
    
    if (!artist){
        next(new ErrorResponse (`Artist with id of ${req.params.id} not found`,404));
    }
    else{
        if (!artist.followers.includes(user.id)) {
            await artist.updateOne({ $push: { followers: user.id } });
            await user.updateOne({ $push: { following: req.params.id } });
            res.status(200).json({success: true,message: 'Artist has been followed'});
          } else {
            res.status(403).json({success: false,message:"Artist already followed by this user"});
          }
       
       

    }      

});

exports.unfollowArtist = asyncHandler(async (req,res,next) =>{
    
    const artist = await Artist.findById(req.params.id);
    const user = req.user;
    
    if (!artist){
        next(new ErrorResponse (`Artist with id of ${req.params.id} not found`,404));
    }
    else{
        if (artist.followers.includes(user.id)) {
            await artist.updateOne({ $pull: { followers: user.id } });
            await user.updateOne({ $pull: { following: req.params.id } });
            res.status(200).json({success: true,message: 'Artist has been unfollowed'});
          } else {
            res.status(403).json({success: false,message:"Artist was not followed by this user"});
          }
       
       

    }      

});