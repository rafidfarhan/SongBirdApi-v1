const mongoose = require("mongoose");
const slugify = require("slugify");

const AlbumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 3,
      max: 300,
      unique: true
    },

    slug :String ,

    albumType:{
        type: String,
        required: true,
        enum: [
            'Standard',
            'Single',
            'Mix tape'
          ]
    },

    artists:[{
        type: mongoose.Schema.ObjectId,
        ref:'Artist',
        required: true
      }],

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
          'Orchestral-pop',
          'Hip-hop'
        ]
    },


    albumArtUrl: {
        type: String
    },

    releaseDate:{
        type: Date,
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

AlbumSchema.pre('save',function(next) {
  this.slug = slugify(this.title,{lower:true});
  next();
});

//Cascading delete of tracks when an album is deleted
AlbumSchema.pre('remove', async function (next){
  console.log(`Tracks of album with id ${this._id} is being deleted`);
  await this.model('Track').deleteMany({album: this._id});
  next();

});

//Reverse Populate

AlbumSchema.virtual('tracks', {
  ref: 'Track',
  localField: '_id',
  foreignField: 'album',
  justOne: false
})


module.exports = mongoose.model("Album", AlbumSchema );