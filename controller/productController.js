import slugify from "slugify";
import productModel from "../model/productModel.js";
import catModel from "../model/catModel.js";
import orderModel from "../model/orderModel.js";
import fs from "fs";
import braintree from "braintree"
import dotenv from "dotenv";

dotenv.config();

//Payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_Merchant_ID,
  publicKey: process.env.BRAINTREE_Public_Key,
  privateKey: process.env.BRAINTREE_Private_Key,
});

//create products
export const createproductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is require" });
      case !description:
        return res.status(500).send({ error: "description is require" });
      case !price:
        return res.status(500).send({ error: "price is require" });
      case !category:
        return res.status(500).send({ error: "category is require" });
      case !quantity:
        return res.status(500).send({ error: " quantity is require" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: " photo  is require should be less than 1 Mb" });
    }

    const product = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Create successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      error,
      message: "errr in product creation",
    });
  }
};

//Get multiple products
export const getproductController = async (req, res) => {
  try {
    const product = await productModel
      .find({})
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      total: product.length,
      message: "AllProducts",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error for get product",
    });
  }
};

//Get Single Product
export const getsingleProduct = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "GetSingleProduct",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error for get single product",
    });
  }
};

//Get photo

export const productphotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error for get single product",
    });
  }
};

//update products
export const updateproductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields || {};
    const { photo } = req.files || {};

    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is require" });
      case !description:
        return res.status(500).send({ error: "description is require" });
      case !price:
        return res.status(500).send({ error: "price is require" });
      case !category:
        return res.status(500).send({ error: "category is require" });
      case !quantity:
        return res.status(500).send({ error: " quantity is require" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: " photo  is require should be less than 1 Mb" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;

    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Update successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      error,
      message: "errr in Product Update",
    });
  }
};

//Delete controller

export const deleteProductController = async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.name).select("-photo");

    if (!deletedProduct) {
      // If the product with the given ID is not found
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error: error.message, // Provide more specific error information
    });
  }
};

//Filter
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked?.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Somthing wrong in filter",
      error,
    });
  }
};

//product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

//search controller

export const serachproductController =async(req, res)=>{
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
}catch(error){
  console.log(error)
  res.status(400).send({
    success: false,
    message: "Error in search category",
    error,
  })
}
}

//similar product

export const relatedproductController =async(req, res)=>{
  try {
    const { pid, cid } = req.params
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
}

// get product by category
export const  productCategoryController =async(req, res)=>{
  try{
    const getcategory = await catModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ getcategory }).populate("category");
    res.status(200).send({
      success: true,
      getcategory,
      products,
  });
  }catch(error){
    console.log(error)
      res.status(400).send({
        success: false,
        Message: ("Something is wrong in this categories"),
        error,
      })
    }
  };

  //payment gateway api
  export const braintreeTokenController = async (req, res)=>{

    try{
      gateway.clientToken.generate({}, function(err,response){
        if(err){
          res.status(500).send(err)
         }else{
          res.send(response);
         }
      })
    }catch(error){
      console.log(error)
    }
  }

  export const braintreePyamentController =async(req, res)=>{
try{
  const {cart,nonce} = req.body
  let total =0
  cart.map((i)=>{total == i.price;
  });
  let newTransaction = gateway.transaction.sale({
    amount:total,
    paymentMethodNonce: nonce,
    options:{
      submitForSettlement:true
    },
},
  
  function (error,result){
    if(result){
      const order = new orderModel({
        product: cart,
        payment:result, 
        buyer: req.user._id
      }).save()
      res.json({ok:true})
    }else{
      res.status(500).send(error)
    }
  }
  )
}catch(error){
  console.log(error)
}
  }