import joi from 'joi';
import {genders} from "./../../Utils/eNums/enums.js";

// Calculate the date that is exactly 18 years ago from today
const today = new Date();
const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18)).toISOString().split('T')[0];

// Register Schema
export const register= joi
  .object({
    firstName: joi.string().min(3).required(),
    lastName: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    DOB: joi.date().less(eighteenYearsAgo).required().messages({
      'date.less': 'User must be older than 18 years'
    }),
    mobileNumber: joi.string().required(),
    gender: joi.string().valid(...Object.values(genders)).required(),
  })
  .required();

// confirm OTP 
export const confirmOTP = joi.object({
  email: joi.string().email().required(),
  OTP : joi.string().required()
}).required()  

// login
export const login = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
}).required()

// login GMAIL
export const loginGmail = joi.object({
  idToken: joi.string().required(),
}).required()

//Send OTP for Forget password
export const OTPForgetPassword = joi.object({
  email: joi.string().email().required(),
}).required()

//Reset password
export const resetPassword = joi.object({
  email: joi.string().email().required(),
  OTP : joi.string().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
}).required()

// new access Token
export const newAccessToken = joi.object({
  refreshToken : joi.string().required()
}).required()
