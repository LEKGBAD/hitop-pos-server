import Router from "express"
import { verifyAuth } from "../middlewares/VerifyAuth.js"
import { addCategory, addGoods, deleteGoods, getCategory, updateGoods } from "../controllers/GoodsControllers.js";

const goodsRoutes=Router();

goodsRoutes.post("/add-goods",verifyAuth,addGoods)
goodsRoutes.post("/add-category",verifyAuth,addCategory)
goodsRoutes.get("/get-category",verifyAuth,getCategory)
goodsRoutes.post("/update",verifyAuth,updateGoods)
goodsRoutes.post("/delete",verifyAuth,deleteGoods)

export default goodsRoutes;