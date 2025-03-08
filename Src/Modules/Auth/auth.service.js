import User from "../../DB/Models/user.model.js";
import Randomstring from "randomstring";
import { emailEmitter } from "./../../Utils/Email/emailEvent.js";
import { compareHash, hash } from "../../Utils/Hashing/Hash.js";
import { generateToken, verifyToken } from "../../Utils/Token/Token.js";
import { OTPTypes, providers } from "../../Utils/eNums/enums.js";
import verify from "../../Utils/Login With Gmail Form/gmailAuth.js/gmailAuth.js";


//----------------------------------------------- Register User --------------------------------------------------
export const register = async (req, res, next) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) return next(new Error("Email Already Exists", { cause: 400 }));

  const otp = Randomstring.generate({ length: 5, charset: "alphanumeric" });
  const expiresIn = new Date(Date.now() + 10 * 60 * 1000);
  //send email with the otp
  emailEmitter.emit("sendOTP", email, "Verify Your Email", otp);
  //hash OTP and save it to db
  const hashedOTP = hash({ plainText: otp });

  const createdUser = new User({
    ...req.body,
    OTP: {
      code: hashedOTP,
      type: OTPTypes.confirmEmail,
      expiresIn,
    },
  });

  await createdUser.save();
  return res
    .status(201)
    .json({
      success: true,
      message:
        "User Created Successfully And An OTP Was Sent To Your Email To Confirm it",
      createdUser,
    });
};

//----------------------------------------------- Confirm OTP --------------------------------------------------
export const confirmOTP = async (req, res, next) => {
  const { email, OTP } = req.body;
  const currentDate = new Date();
  const user = await User.findOne({ email });
  if (!user) return next(new Error("Email Not Found", { cause: 404 }));

  for (const userOTP of user.OTP) {
    const exactOTP = compareHash({ plainText: OTP, hash: userOTP.code });

    if (userOTP.expiresIn < currentDate || exactOTP == false || userOTP.type != OTPTypes.confirmEmail)
      continue;

    user.updateMobileNumber=true;
    user.isConfirmed = true;
    user.save();
    return res
      .status(201)
      .json({ success: true, message: "Email is Activated Please Login" });
  }

  return next(new Error("Invalid OTP", { cause: 400 }));
};

//----------------------------------------------- Sign In (system) --------------------------------------------------
export const login = async (req, res, next) => {

  const { email, password } = req.body;
  // Check User Existence
  const user = await User.findOne({ email , provider:providers.system});
  if (!user) return next(new Error("Invalid Email !!", { cause: 400 }));

  // Check Password
  const matchPassword = compareHash({
    plainText: password,
    hash: user.password,
  });
  if (!matchPassword)
    return next(new Error("Invalid Password !!", { cause: 400 }));

  // Check If User Is Verified First
  if (!user.isConfirmed)
    return next(new Error("Please Activate Your Account !!", { cause: 400 }));
  
  //If user is freezed Return Account
  if (user.isDeleted == true)
    await User.updateOne({ _id: user._id }, { isDeleted: false });

  // Generate Token
  const accessToken = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  });
  const refreshToken = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
  });

  return res.status(200).json({
    success: true,
    message: "Logged In Successfully",
    accessToken,
    refreshToken,
  });
};

//----------------------------------------------- Sign In/UP (GMAIL) --------------------------------------------------
export const loginGmail = async (req, res, next) => {

  const { idToken } = req.body;
  const userData = await verify(idToken);
  const { email_verified, email, name, picture,given_name, family_name } = userData;

  if (!email_verified)
    return next(new Error("Invalid Email !!", { cause: 400 }));

  let user = await User.findOne({email});

  if(!user)
  {
    user = await User.create({
    email,
    firstName: given_name,
    lastName : family_name,
    isConfirmed: true,
    provider: providers.google,
    })

  }

  if(user.provider != providers.google)
    return next(new Error ("Invalid Provider" , {cause:400}))

  //Generate Token
  const accessToken = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  });
  const refreshToken = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
  });

  return res
    .status(200)
    .json({ success: true, results: { accessToken, refreshToken } });
};

//----------------------------------------------- Send OTP for Forget password --------------------------------------------------
export const OTPForgetPassword = async (req, res, next) => {

  const {email} = req.body;
  const user = await User.findOne({email, provider:providers.system, isDeleted:false}) 
  
  if(!user)
    return next(new Error("USer Not Found !!" , {cause:404}))

  // Send OTP
  const otp = Randomstring.generate({ length: 5, charset: "alphanumeric" });
  const expiresIn = new Date(Date.now() + 10 * 60 * 1000);
  //send email with the otp
  emailEmitter.emit("sendOTP", email, "Reset Password", otp);

  //hash OTP and save it to db
  const hashedOTP = hash({ plainText: otp });
  user.updateMobileNumber =true ;
  user.OTP.push({code:hashedOTP, type:OTPTypes.forgetPassword, expiresIn})
  await user.save()

  return res
    .status(200)
    .json({ success: true, message:"An OTP Was Sent To Your Email"});
};

//----------------------------------------------- Reset password --------------------------------------------------
export const resetPassword = async (req, res, next) => {

  const {email, OTP, password} = req.body;
  const currentDate = new Date();

  const user = await User.findOne({email, provider:providers.system, isDeleted:false}) 
  
  if(!user)
    return next(new Error("User Not Found !!" , {cause:404}))

  //Check OTP
  for (const userOTP of user.OTP) {
    const exactOTP = compareHash({ plainText: OTP, hash: userOTP.code });

    if (userOTP.expiresIn < currentDate || exactOTP == false || userOTP.type != OTPTypes.forgetPassword)
      continue;

    user.updatePassword = true;
    user.updateMobileNumber=true;
    user.password = password;
    await user.save();
    return res
      .status(201)
      .json({ success: true, message: "Password Reset Successfully, Please Login" });
  }

  return next(new Error("Invalid OTP", { cause: 400 }));
  

  return res
    .status(200)
    .json({ success: true, message:"An OTP Was Sent To Your Email"});
};


//----------------------------------------------- New Access Token --------------------------------------------------
export const newAccessToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  const payload = verifyToken({ token: refreshToken });

  if(!payload?.id)
    return next(new Error("Invalid Token Payload" , {cause:401}))

  const user = await User.findById(payload.id);
  if (!user) return next(new Error("User Not Found !!", { cause: 404 }));


  if(user.changeCredentialTime?.getTime() >= payload.iat*1000)
    return next(new Error("Invalid Login Credentials, Please Login Again" , {cause:400}))

  const accessToken = generateToken({
    payload: { id: payload.id, email: payload.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  });
  return res.status(200).json({ success: true, accessToken });
};