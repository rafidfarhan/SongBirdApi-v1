const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 300
    },

    playlistType:{
        type: String,
        enum: [
            'Featured',
            'UserPlaylist',
          ],
          default: 'UserPlaylist'
    },
    tracks : [{
        type: mongoose.Schema.ObjectId,
        ref:'Track',
        default: []
      }],
      
      owner :{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: true
      },

    createdAt: {
        type: Date,
        default: Date.now,
    }
   

  }, {
    toJSON: {virtuals :true},
    toObject: {virtuals :true}
  });

//Cascading delete of tracks when an album is deleted
// AlbumSchema.pre('remove', async function (next){
//   console.log(`Tracks of album with id ${this._id} is being deleted`);
//   await this.model('Track').deleteMany({album: this._id});
//   next();

// });


module.exports = mongoose.model("Playlist", PlaylistSchema );