const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const asyncHandler = require("../middleware/async");
const crypto = require("crypto");
const path = require('path');


exports.register = asyncHandler(async (req,res,next) =>{
    const {username, email,password,profilePicture,isAdmin} = req.body;
    const user = await User.create({
        username,
        email,
        password,
        profilePicture,
        isAdmin
    });

    sendTokenResponse(user,200,res);

});

exports.login = asyncHandler(async (req,res,next) =>{
    const {email,password} = req.body;

    if(!email || !password){
        return next(new ErrorResponse('Please add email and password',400))
    }

    const user = await User.findOne({ email:email}).select('+password');

    if(!user){
        return next(new ErrorResponse('Invalid Credentials',401))
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next(new ErrorResponse('Invalid Credentials',401))
    }
   
    sendTokenResponse(user,200,res);

});

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});


exports.getMe = asyncHandler(async (req, res, next) => {
    // user is already available in req due to the protect middleware
    const user = req.user;
  
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
      username: req.body.username,
      email: req.body.email,
    };
  
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  exports.profileImageUpload = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
  
    const file = req.files.file;
  
    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }
  
    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
  
    // Create custom filename
    file.name = `photo_${user._id}${path.parse(file.name).ext}`;
  
    file.mv(`${process.env.FILE_UPLOAD_PATH_PROFILE_PIC}/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
  
      await User.findByIdAndUpdate(req.user.id, { profilePicture: file.name });
  
      res.status(200).json({
        success: true,
        data: file.name
      });
    });
  });


  exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
  
    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Incorrect password', 401));
    }
  
    user.password = req.body.newPassword;
    await user.save();
  
    sendTokenResponse(user, 200, res);
  });

  
  exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }
  
    // Get reset token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/auth/resetpassword/${resetToken}`;
  
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });
  
      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorResponse('Email could not be sent', 500));
    }
  });

  exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }
  
    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
  
    sendTokenResponse(user, 200, res);
  });

//Get token from model and create cookie, send response
const sendTokenResponse = (user, statusCode,res) =>{
    const token =user.getSignedJwtToken();

    const options = {
        expires : new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRE *24*60*60*1000),
        httpOnly : true
    };
    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        token
           
    });
}