const Playlist = require("../models/playlistModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

exports.createPlaylist = asyncHandler(async (req,res,next) =>{
    req.body.owner = req.user.id;
        const playlist = await Playlist.create(req.body);
        res.status(201).json({
            success: true,
            message: "Playlist created",
            data: playlist
        });

});

exports.getPlaylist = asyncHandler(async (req,res,next) =>{
    
        const playlist = await Playlist.findById(req.params.id).populate([{
          path: 'tracks',
          select : 'title streamUrl duration slug'
      },
      {
          path: 'owner',
          select : 'username'
      }
  ]);
        if (!playlist){
            next(new ErrorResponse (`Playlist with id of ${req.params.id} not found`,404));
        }
        else{
            res.status(200).json({success: true,data: playlist});
        }
});

exports.getPlaylists = asyncHandler(async (req,res,next) =>{
    
        const playlists = await Playlist.find().populate([{
          path: 'tracks',
          select : 'title streamUrl duration slug'
      },
      {
          path: 'owner',
          select : 'username'
      }
  ]);
        res.status(200).json({success: true,count : playlists.length ,data: playlists});
});


exports.updatePlaylist = asyncHandler(async (req, res, next) => {
    let playlist = await Playlist.findById(req.params.id);
  
    if (!playlist) {
      return next(
        new ErrorResponse(`Playlist with id of ${req.params.id} not found`, 404)
      );
    }
  
    // Make sure user is playlist owner
    if (playlist.owner.toString() !== req.user.id && req.user.userType !== 'admin') {
      return next(
        new ErrorResponse(
          `User with id ${req.user.id} is not authorized to update this playlist`,
          401
        )
      );
    }
  
    playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({ success: true, data: playlist });
  });
  
  exports.addSongToPlaylist = asyncHandler(async (req, res, next) => {
    let playlist = await Playlist.findById(req.params.id);
  
    if (!playlist) {
      return next(
        new ErrorResponse(`Playlist with id of ${req.params.id} not found`, 404)
      );
    }
  
    // Make sure user is playlist owner
    if (playlist.owner.toString() !== req.user.id && req.user.userType !== 'admin') {
      return next(
        new ErrorResponse(
          `User with id ${req.user.id} is not authorized to update this playlist`,
          401
        )
      );
    }

    if (!playlist.tracks.includes(req.body.trackId)) {
        await playlist.updateOne({ $push: { tracks: req.body.trackId }});
        res.status(200).json({ success: true, 
            message: `Song added to playlist wih id ${req.params.id}`, 
            data: playlist 
        });
      } else {
        res.status(403).json({ success: false, 
            message: `Song already saved to playlist wih id ${req.params.id}`, 
            data: playlist 
        });
      }

   
  });

  exports.removeSongToPlaylist = asyncHandler(async (req, res, next) => {
    let playlist = await Playlist.findById(req.params.id);
  
    if (!playlist) {
      return next(
        new ErrorResponse(`Playlist with id of ${req.params.id} not found`, 404)
      );
    }
  
    // Make sure user is playlist owner
    if (playlist.owner.toString() !== req.user.id && req.user.userType !== 'admin') {
      return next(
        new ErrorResponse(
          `User with id ${req.user.id} is not authorized to update this playlist`,
          401
        )
      );
    }

    if (playlist.tracks.includes(req.body.trackId)) {
        await playlist.updateOne({ $pull: { tracks: req.body.trackId }});
        res.status(200).json({ success: true, 
            message: `Song removed from playlist wih id ${req.params.id}`
        });
      } else {
        res.status(403).json({ success: false, 
            message: `Song does not exist in the playlist wih id ${req.params.id}`
        });
      }

   
  });


  exports.deletePlaylist = asyncHandler(async (req, res, next) => {
    const playlist = await Playlist.findById(req.params.id);
  
    if (!playlist) {
      return next(
        new ErrorResponse(`Playlist with id of ${req.params.id} not found`, 404)
      );
    }
  
    // Make sure user is playlist owner
    if (playlist.owner.toString() !== req.user.id && req.user.userType !== 'admin') {
      return next(
        new ErrorResponse(
            `User with id ${req.user.id} is not authorized to delete this playlist`,
            401
        )
      );
    }
  
    await playlist.remove();
  
    res.status(200).json({ success: true, data: {} });
  });

  exports.savePlaylist = asyncHandler(async (req,res,next) =>{
    
    const playlist = await Playlist.findById(req.params.id);
    const user = req.user;
    
    if (!playlist){
        next(new ErrorResponse (`Playlist with id of ${req.params.id} not found`,404));
    }
    else{
        if (!user.savedPlaylists.includes(playlist.id)) {
            await user.updateOne({ $push: { savedPlaylists: req.params.id } });
            res.status(200).json({success: true,message: 'Playlist has been saved'});
          } else {
            res.status(403).json({success: false,message:"Playlist already saved by this user"});
          }
    }      

});

exports.removeSavedPlaylist = asyncHandler(async (req,res,next) =>{
    
  const playlist = await Playlist.findById(req.params.id);
  const user = req.user;
  
  if (!playlist){
      next(new ErrorResponse (`Playlist with id of ${req.params.id} not found`,404));
  }
  else{
      if (user.savedPlaylists.includes(playlist.id)) {
          await user.updateOne({ $pull: { savedPlaylists: req.params.id } });
          res.status(200).json({success: true,message: 'Playlist has been removed from collection'});
        } else {
          res.status(403).json({success: false,message:"Playlist was not saved by this user"});
        }
  }      

});

exports.getSavedPlaylists= asyncHandler(async (req,res,next) =>{
    
  const user = req.user;
  const playlists = await Promise.all(
      user.savedPlaylists.map((playlistId) => {
        return Playlist.findById(playlistId).populate([{
          path: 'tracks',
          select : 'title streamUrl duration slug'
      }
  ]);
      })
    );
  

  res.status(200).json({success: true, data: playlists});
  
});

exports.getCreatedPlaylists= asyncHandler(async (req,res,next) =>{

  const playlists = req.user.createdPlaylists;
  res.status(200).json({success: true, data: playlists});
  
});

