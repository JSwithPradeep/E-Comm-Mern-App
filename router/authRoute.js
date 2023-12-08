import express from 'express'
import { registerController , loginController, testController,
    orderController,allOrderController, forgotPasswordController, 
    orderStatusController, updateProfileController} from '../controller/authController.js';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';

const router = express.Router()
//Register
router.post('/register',  registerController );

//Login
router.post("/login", loginController);

//Forgo Password || POST
router.post("/forgot-password", forgotPasswordController);

//test
router.get("/test",requireSignIn, isAdmin ,  testController)

//protected route
router.get('/user-auth', requireSignIn,(req,res)=>{
    res.status(200).send({ok: true});
    });

    //Admin route
router.get('/admin-auth', requireSignIn, isAdmin ,(req,res)=>{
    res.status(200).send({ok: true});
    });

router.put('/profile', requireSignIn, updateProfileController)

//order route
router.get('/order', requireSignIn, orderController)

//allorder route
router.get('/all-order', requireSignIn, allOrderController)

//order status update
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController)
export default router;