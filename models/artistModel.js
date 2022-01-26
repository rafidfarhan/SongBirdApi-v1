const mongoose = require("mongoose");
const slugify = require("slugify");

const ArtistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 300,
      unique: true
    },

    slug :String ,
    about : {
        type: String,
        required: true,
        min: 3
        
    },
    coverUrl: {
        type:String
    },

    profileImgUrl : {
        type:String
    },
    
    facebookUrl : {
      type:String,
      default: null
    },
    instagramUrl : {
    type:String,
    default: null
  },
  twitterUrl : {
    type:String,
    default: null
  },
  youtubeUrl : {
    type:String,
    default: null
  },
  topArtist:{
    type: Boolean,
    default: false
  },


    albums:{
        type: [mongoose.Schema.ObjectId],
        ref:'Album',
        default: []
    },

    followers :  [{
      type: mongoose.Schema.ObjectId,
      ref:'User',
      default: []
    }],
    createdAt: {
      type: Date,
      default: Date.now,
  }

  }, {
    toJSON: {virtuals :true},
    toObject: {virtuals :true}
  });


ArtistSchema.pre('save',function(next) {
  this.slug = slugify(this.name,{lower:true});
  next();
});

//Cascading delete of tracks when an album is deleted
// ArtistSchema.pre('remove', async function (next){
//   console.log(`Albums of artist with id ${this._id} is being deleted`);
//   await this.model('Album').deleteMany({artists: this._id});
//   next();

// });

//Reverse Populate

// ArtistSchema.virtual('albums', {
//   ref: 'Album',
//   localField: '_id',
//   foreignField: 'artists',
//   justOne: false
// })


module.exports = mongoose.model("Artist", ArtistSchema );