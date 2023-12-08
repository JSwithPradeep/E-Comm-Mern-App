import  express  from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./router/authRoute.js";
import catRout from "./router/catRout.js";
import productRouter from "./router/productRouter.js"
import cors from 'cors';
import path from "path"
import {fileURLToPath} from "url";
dotenv.config();
const app = express();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Midleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.static((path.join(__dirname, './client/build'))))

//routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/cat', catRout)
app.use('/api/v1/product', productRouter)

//REST API
app.use('*', function(req,res){
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});
// app.get("/",(req, res)=>{
//     res.send({
//         message: "welcome to ecoomerce platform"
//     });
// });

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`Server Running on ${PORT}`);
})