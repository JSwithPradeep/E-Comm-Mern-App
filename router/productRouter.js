import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { createproductController ,getproductController, deleteProductController,
    getsingleProduct, productphotoController ,  updateproductController, productFilterController,
    productCountController ,  productListController , relatedproductController,
    serachproductController,productCategoryController, braintreeTokenController,braintreePyamentController} from "../controller/productController.js";
import formidable from "express-formidable"
import braintree from "braintree";

const router = express.Router();

router.post("/create-product", requireSignIn, isAdmin, formidable(), createproductController);
router.get("/get-product", getproductController);
router.get("/get-product/:slug" , getsingleProduct);
router.get("/product-photo/:pid", productphotoController);
router.put("/update-product/:pid", updateproductController);
router.delete("/delete-product/:pid" , deleteProductController);
router.post("/product-filters", productFilterController)
router.get("/product-count", productCountController )
router.get("/product-list/:page",  productListController )
router.get("/search-product/:keyword", serachproductController)
router.get("/related-product/:pid/:cid", relatedproductController)
router.get("/productcategory/:slug", productCategoryController)

// router.delete("delete-product", deleteproductController)


//Payment gateway routes
//get token
router.get('/braintree/token', braintreeTokenController)
//payments
router.post('/braintree/payment', requireSignIn, braintreePyamentController)
export default router;