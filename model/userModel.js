import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
name:{
    type:String,
    require:true,
    trim:true
},

email:{
    type:String,
    require:true,
    unique:true
},

mobile:{
    type:String,
    require:true,
    unique:true
},

password: {
    type: String,
    required: true
  },

add:{
    type:String,
    require:true

},

answr: {
type: String,
require: true,
},

role: {
    type: Number,
    default: 0,
  },

});
//export default mongoose.model("users", userSchema);

const users = mongoose.models.users || mongoose.model('users',userSchema);
export default users;
