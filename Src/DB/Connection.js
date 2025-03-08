import mongoose from "mongoose";


export const connectDB = async() =>{  
  
  await mongoose.connect(process.env.CONNECTION_URI)
  .then(()=>console.log("DB Connected Successfully"))
  .catch((error)=> console.log(`Failed To Connect DB ${error.message}`))
  
  }