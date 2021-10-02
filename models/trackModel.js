const mongoose = require("mongoose");
const slugify = require("slugify");

const TrackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 3,
      max: 300,
      unique: true
    },

    slug :String ,

    album:{
        type: mongoose.Schema.ObjectId,
        ref:'Album',
        required: true
    },
    
    streamUrl:{
        type: String,
        required: true
    },
    duration :{
        type: Number,
        required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
  }

  }
);

TrackSchema.pre('save',function(next) {
  this.slug = slugify(this.title,{lower:true});
  next();
});


module.exports = mongoose.model("Track", TrackSchema );