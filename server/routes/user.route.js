import express from "express"
import {registeruser,loginuser,refreshAccessToken} from "../controllers/user.controller.js"
import multer from "multer";
const router=express.Router();
const upload = multer({ dest: "uploads/" }); 
router.post("/register",upload.single("avatar"),registeruser)
router.post('/login',loginuser)
router.post('/refresh-token',refreshAccessToken)

export default router;
