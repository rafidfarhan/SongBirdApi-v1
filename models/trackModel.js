const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema(
  {
    trackName: {
      type: String,
      required: true,
      min: 3,
      max: 300,
      unique: true,
    },

    slug :String ,

    albumType:{
        type: String,
        required: true,
        max: 15,
    },

    albumTitle:{
        type: String,
        required: true,
        max: 80,
    },


    artist: {
      type: String,
      required: true,
      max: 60,
    },

    genre: {
        type: String,
        required: true,
        enum: [
          'Rock',
          'Pop',
          'Country',
          'Folk',
          'Jazz',
          'Indie',
          'Electro-pop',
          'Hip-hop'
        ],
        max: 60,
    },


    albumArtUrl: {
        type: String,
    },

    streamUrl:{
        type: String,
        required: true,
    },
    releaseDate:{
        type: String,
        required: true,
    },
    duration :{
        type: Number,
        required: true,
    }

  }
);

module.exports = mongoose.model("Track", TrackSchema );