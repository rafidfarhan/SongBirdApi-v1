const crypto = require('crypto');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ],
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: String,

    likedSongs : [{
      type: mongoose.Schema.ObjectId,
      ref:'Track',
      default: []
    }],

    savedAlbums : [{
      type: mongoose.Schema.ObjectId,
      ref:'Album',
      default: []
    }],

    savedPlaylists:  [{
      type: mongoose.Schema.ObjectId,
      ref:'Playlist',
      default: []
    }],

    recentTracks: [{
      type: mongoose.Schema.ObjectId,
      ref:'Track',
      maxItems: 12,
      default: []
    }],
    
    
    profilePicture: {
      type: String,
      default: null
    },

    following :  [{
      type: mongoose.Schema.ObjectId,
      ref:'Artist',
      default: []
    }],


    userType: {
      type: String,
      enum: [
        'user',
      ],
      default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
  },{
    toJSON: {virtuals :true},
    toObject: {virtuals :true}
  });

  UserSchema.virtual('createdPlaylists', {
    ref: 'Playlist',
    localField: '_id',
    foreignField: 'owner',
    justOne: false
  })
  

  //Encryption Middleware

  UserSchema.pre('save', async function(next){
    
    if (!this.isModified('password')) {
      next();
    }
  
      const salt = await bcrypt.genSalt(10); 
      this.password = await bcrypt.hash(this.password,salt);
  });

//Token generating method
  UserSchema.methods.getSignedJwtToken = function () {
      return jwt.sign({id : this._id},process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRE})
  }
  //Matching User entered password with hashed password

  UserSchema.methods.matchPassword = async function (enteredPass) {
    return await bcrypt.compare(enteredPass, this.password);
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);