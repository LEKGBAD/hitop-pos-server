import Router from "express"
import { verifyAuth } from "../middlewares/VerifyAuth.js"
import { SubmitSale, deleteSale, getGoods, getItems, getSales, itemsFilter, makePayment, salesFilter } from "../controllers/SalesControllers.js";

const salesRoutes=Router();


salesRoutes.post("/submit-sale",verifyAuth,SubmitSale)
salesRoutes.post("/filter",verifyAuth,salesFilter)
salesRoutes.post("/pay",verifyAuth,makePayment)
salesRoutes.get("/get-goods",verifyAuth,getGoods)
salesRoutes.get("/get-sales",verifyAuth,getSales)
salesRoutes.get("/get-items",verifyAuth,getItems)
salesRoutes.post("/items-filter",verifyAuth,itemsFilter)
salesRoutes.post("/delete",verifyAuth,deleteSale)
export default salesRoutes;