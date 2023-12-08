import mongoose from "mongoose";

const catSchema = new mongoose.Schema({
    name:{
        type:String,
        // require:true,
        // unique:true,
    },
    slug:{
        type: String,
        lowercase: true,
    },
});

export default mongoose.model("category", catSchema);