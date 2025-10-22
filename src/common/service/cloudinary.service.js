import { v2 as cloudinaryv2 } from "cloudinary";

cloudinaryv2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Upload
export const uploadFileOneCloudinary=async(file,option)=>{
   try{
     const result=await cloudinaryv2.uploader.upload(file,option)
    return result;
   }catch(err){
    console.log(err);
   }

};
export const uploadFilesCloudinary=async(files,option)=>{
    const result =[];
    for(const file of files){
     const {secure_url,public_id} = await uploadFileOneCloudinary(file,option)
     result.push({secure_url,public_id})
    }
    return result
    
}
// Delete
export  const deleteFileCloudinary=async(public_id)=>{
    const result=await cloudinaryv2.uploader.destroy(public_id)
    return result
};
export const deleteFilesCloudinary=async(public_ids)=>{
    const result=await cloudinaryv2.api.delete_resources(public_ids);
    return result;
};
export const cleanupFolderFromCloudinary=async(folder_name)=>{
    const result=await cloudinaryv2.api.delete_resources_by_prefix(folder_name);
    return result;
};
export const deleteFolderFromCloudinary=async(folder_name)=>{
    await cleanupFolderFromCloudinary(folder_name)
    const result=await cloudinaryv2.api.delete_folder(folder_name);
    return result;
}

