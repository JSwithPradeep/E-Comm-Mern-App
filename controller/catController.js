import catModel from "../model/catModel.js"
import slugify from "slugify";

export const createcatController = async(req, res)=>{
try{
    const {name} = req.body;
    if(!name){
        return res.status(401).send({message: "Name is require"});
    }
    const exitCat = await catModel.findOne({name})
    if(exitCat){
        return res.status(200).send({
            success: true,
            message: "Category Already Exiting"
        })
    }
    const category = await new catModel({name, slug:slugify(name)}).save()
    res.status(201).send({
        success: true,
        message: "new category created",
        category
    })

} catch(error){
    console.log(error)
    res.status(500).send({
        success: false,
        error,
        message: "Error in category"
    })
}
}

//update category
export const updateCategoryController= async(req, res)=>{
try{
const {name} = req.body;
const {id} = req.params;

const category = await catModel.findByIdAndUpdate(id,{name, slug:slugify(name)},{new:true});
res.status(200).send({
    success:true,
    message: "Error while Update category",
    category,
});
}catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        error,
        message: "Error in Update category"
    })
}
}

//get all category
export const getcatController =async(req, res)=>{
  try{
    const getcategory = await catModel.find({})
    res.status(200).send({
        success: true,
        message: "All categories List",
        getcategory,
    });
  }catch(error){
    console.log(error)
    res.status(500).send({
        success: false,
        error,
        message: "Error while getting all categories",
    });
  }
};

//get single cat
export const  singlecatController = async(req, res)=>{
try{
 const singlecat = await catModel.findOne({slug:req.params.slug})
 res.status(200).send({
    success: true,
    message: "Get Single Category Successfully",
    singlecat,
 }) 
}catch(error){
    console.log(error)
    res.status(500).send({
        success: false,
        error,
        message: "Error in single category"
    })
}
}

//Delete category

export const deletecatController =async(req, res)=>{
    try{
        const id =  mongoose.Types.ObjectId(req.params.id.trim());
        await catModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message:"Category Deleted successfully"
        })
    }catch(error){
        console.log(error)
       res.status(500).send({
        success: false,
        error,
        message: "Data not deleted"
       })
       
    }
}