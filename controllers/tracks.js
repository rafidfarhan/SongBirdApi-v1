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

exports.likeTrack = asyncHandler(async (req,res,next) =>{
    
    const track = await Track.findById(req.params.id);
    const user = req.user;
    
    if (!track){
        next(new ErrorResponse (`Track with id of ${req.params.id} not found`,404));
    }
    else{
        if (!user.likedSongs.includes(track.id)) {
            await user.updateOne({ $push: { likedSongs: req.params.id } });
            res.status(200).json({success: true,message: 'Song has been liked'});
          } else {
            res.status(403).json({success: false,message:"Song already liked by this user"});
          }
       
       

    }      

});
// exports.addToRecentTracks = asyncHandler(async (req,res,next) =>{
    
//     const track = await Track.findById(req.params.id);
//     const user = req.user;
//     const recent = req.user.recentTracks;
    
//     if (!track){
//         next(new ErrorResponse (`Track with id of ${req.params.id} not found`,404));
//     }
//     else{
//         if(recent.length >= 12){

//         }
//         else{
//              if (!user.recentSongs.includes(track.id)) {
//                 await user.updateOne({ $pull: { recentSongs: req.params.id } });
//                 await user.updateOne({ $push: { recentSongs: req.params.id } });
//                 res.status(200).json({success: true,message: 'Song has been liked'});
//           }
//         }
//         // if (!user.likedSongs.includes(track.id)) {
//         //     await user.updateOne({ $push: { likedSongs: req.params.id } });
//         //     res.status(200).json({success: true,message: 'Song has been liked'});
//         //   } else {
//         //     res.status(403).json({success: false,message:"Song already liked by this user"});
//         //   }
       
       

//     }      

// });

exports.removeLikedTrack = asyncHandler(async (req,res,next) =>{
    
    const track = await Track.findById(req.params.id);
    const user = req.user;
    
    if (!track){
        next(new ErrorResponse (`Track with id of ${req.params.id} not found`,404));
    }
    else{
        if (user.likedSongs.includes(track.id)) {
            await user.updateOne({ $pull: { likedSongs: req.params.id } });
            res.status(200).json({success: true,message: 'Like removed from song'});
          } else {
            res.status(403).json({success: false,message:"Song was not liked by user"});
          }
       
       

    }      

});
exports.getLikedTracks= asyncHandler(async (req,res,next) =>{
    
    const user = req.user;
    const tracks = await Promise.all(
        user.likedSongs.map((trackId) => {
          return Track.findById(trackId).populate('album')
        })
      );
    
  
    res.status(200).json({success: true, data: tracks});
    
  });

  