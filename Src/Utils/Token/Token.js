import jwt from 'jsonwebtoken';

export const generateToken = ({payload, signature=process.env.JWT_SECRET , options={}})=>{
    return jwt.sign(payload, signature, options)
}

export const verifyToken = ({token, signature=process.env.JWT_SECRET})=>{
    return jwt.verify(token, signature)
}