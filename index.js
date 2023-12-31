import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/Authroutes.js";
import salesRoutes from "./routes/SalesRoutes.js";
import goodsRoutes from "./routes/GoodsRoutes.js";

dotenv.config();
const app = express();
const port=process.env.PORT;

app.use(cors({origin:[process.env.PUBLIC_URL],methods:["GET","POST","PUT","PATCH","DELETE"],credentials:true}));


app.use(cookieParser())
app.use(express.json()); 

app.use("/api/auth",authRoutes)
app.use("/api/sales",salesRoutes)
app.use("/api/goods",goodsRoutes)

app.listen(port,()=>{
    console.log(`app listening on port 3001`);
})