import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

// diskStorage ---> save the file in filesystem
// diskStorage ---> ({destination: (take function or string), filename: (take function (req, file, cb))})

// multer ---> ({storage: (take the return of diskStorage)})

export const fileValidation = {
  images : ["image/png", "image/jpeg"],
  pdfs : ["application/pdf"],
  videos :[]
}

export const uploadCloud = (fileType, folder) => {
  //DiskStorage
  const storage = diskStorage({})  // Store in temp folder


  //File Filter
  const fileFilter = (req,file,cb)=>{
    if(!fileType.includes(file.mimetype))
      return cb(new Error(`Invalid Format !! Only ${JSON.stringify(fileType)} is Acceptable`  , {cause:400}), false)
    return cb(null  ,true)

  }

  //Multer
  const multerUpload = multer({storage, fileFilter});

  return multerUpload // this is an object contain some functions (single, array, fields, none ,......)
};
