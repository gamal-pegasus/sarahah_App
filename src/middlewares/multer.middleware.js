import multer from "multer";
import fs from "node:fs";
import { allowedFileExtensions, fileTypes } from "../common/constants/files.constants.js";
function checkOrCreateFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath,{ recursive: true });
  }
}
//Upload locally
export const loclaUpload = ({ folderPath = "samoles" }) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const fileDir = `uploads/${folderPath}`;
      checkOrCreateFolder(fileDir);
      cb(null, fileDir);
    },
    filename: (req, file, cb) => {

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null,`${uniqueSuffix}__${file.originalname}`)
    },
    
  });
  const fileFilter=(req,file,cb)=>{
    const fileKey=file.mimetype.split('/')[0].toUpperCase()

    
    const fileType=fileTypes[fileKey]

    
    if(!fileType)return cb(new Error('invalid file type'),false)
        const fileExtension=file.mimetype.split('/')[1]

    
    if(!allowedFileExtensions[fileType].includes(fileExtension)){
        return cb(new Error('invalid file extension'),false)
    }
    return cb(null,true)
  }
  return multer({limits:{files:1},fileFilter,storage})
};
export const hostUpload = () => {
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      console.log('fileeeee',file);
      

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null,`${uniqueSuffix}__${file.originalname}`)
    },
    
  });
  const fileFilter=(req,file,cb)=>{
    const fileKey=file.mimetype.split('/')[0].toUpperCase()
 
    
    const fileType=fileTypes[fileKey]

    
    if(!fileType)return cb(new Error('invalid file type'),false)
        const fileExtension=file.mimetype.split('/')[1]

    
    if(!allowedFileExtensions[fileType].includes(fileExtension)){
        return cb(new Error('invalid file extension'),false)
    }
    return cb(null,true)
  }
  return multer({limits:{files:1},fileFilter,storage})
};
