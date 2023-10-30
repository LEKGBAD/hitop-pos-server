import Router from "express"
import { verifyAuth } from "../middlewares/VerifyAuth.js"
import { addTeller, changePassword, deleteUsers, getUser, getUsers, login, updateUsers } from "../controllers/AuthControllers.js";

const authRoutes=Router();

authRoutes.post("/add-teller",addTeller)
authRoutes.post("/login",login)
authRoutes.post("/verify",verifyAuth,getUser)
authRoutes.get("/get-users",verifyAuth,getUsers)
authRoutes.post("/update",verifyAuth,updateUsers)
authRoutes.post("/delete",verifyAuth,deleteUsers)
authRoutes.post("/change-password",verifyAuth,changePassword)
export default authRoutes;