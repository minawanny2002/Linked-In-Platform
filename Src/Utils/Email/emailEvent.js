import { EventEmitter } from "events";
import jwt from "jsonwebtoken";
import sendEmails, { subjects } from "./sendEmails.js";
import { verifyWithOtp ,verifyNewMail, acceptRejectApp} from "./generateHTML.js";
import { generateToken } from "../Token/Token.js";


export const emailEmitter = new EventEmitter();

emailEmitter.on("sendOTP" , async(email,title,otp)=>{

    const isSent = await sendEmails({to:email, subject:subjects.register, html:verifyWithOtp(title,otp)}) 
})

emailEmitter.on("verifyNewEmail" , async(email,id,title)=>{
    const verificationToken = generateToken({payload:{email, id}})
    const verificationLink = `http://localhost:3000/auth/verify-new-mail/${verificationToken}`
    const isSent = await sendEmails({to:email, subject:subjects.register, html:verifyNewMail(verificationLink,title)}) 
})

emailEmitter.on("acceptRejectApp" , async(email,title, status)=>{
    const isSent = await sendEmails({to:email, subject:title, html:acceptRejectApp(title,status)}) 
})