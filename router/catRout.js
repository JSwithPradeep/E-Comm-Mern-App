import express from 'express';
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

import { createcatController, updateCategoryController,  getcatController, singlecatController , deletecatController} from "../controller/catController.js";

const router = express.Router();

//route
router.post("/create-category", requireSignIn, isAdmin, createcatController);
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);
router.get("/get-category", getcatController);
router.get("/single-cat/:slug", singlecatController)
router.delete("/delete-cat/:id",  requireSignIn, isAdmin, deletecatController)
export default router;