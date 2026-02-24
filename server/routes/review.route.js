import express from "express"
import {reviewpost,postprivate,fetchpost,toggleLike,toggleSavePost,fetchsaveddata,removeparticularbookmark} from "../controllers/review.controller.js"
const router=express.Router()

router.post("/reviewpost",reviewpost)
router.patch("/postprivate",postprivate)
router.get("/fetchpost",fetchpost)
router.patch("/togglelike/:reviewId", toggleLike);
router.patch('/save-post',toggleSavePost)
router.get('/bookmark/:userId',fetchsaveddata)
router.delete("/removeparticularbookmark/:userId/:bookId",removeparticularbookmark)
export default router;