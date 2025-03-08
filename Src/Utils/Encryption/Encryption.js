import Cryptojs from "crypto-js";

export const encrypt = ({plainText, secretKey=process.env.SECRET_KEY})=>{
    return Cryptojs.AES.encrypt(plainText, secretKey).toString()
}


export const decrypt = ({cipherText, secretKey=process.env.SECRET_KEY})=>{
    return Cryptojs.AES.decrypt(cipherText, secretKey).toString(Cryptojs.enc.Utf8)
}