import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log("Connect To Mongodb Database")
    }catch(error){
        console.log(`error in MongoDb ${error}`)
    }
}

export default connectDB;