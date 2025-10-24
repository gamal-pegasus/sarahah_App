import mongoose from "mongoose";


const dbConnection=async()=>{
try{
    console.log(process.env.DB_URL_LOCAL);
    
    await mongoose.connect(process.env.DB_URL_LOCAL,{});
    console.log('Database Connected Successfully');
    
}catch(err){
    console.log('Database Connection Failed',err);
    
}

}

export default dbConnection